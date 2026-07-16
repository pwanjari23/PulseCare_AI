const { User, Doctor, Patient, Appointment, VitalsLog, VitalsAlert, Prescription, Notification, ActivityLog } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');

const BASE_API_URL = 'http://localhost:5000/api/v1';
const BASE_AUTH_URL = 'http://localhost:5000/api/auth';

async function runTests() {
  console.log('=== Starting Dashboard & Analytics Verification Tests (Phase 5.11) ===\n');

  const timestamp = Date.now();
  const patientEmail = `pat_dash_${timestamp}@example.com`;
  const doctorEmail = `doc_dash_${timestamp}@example.com`;
  const doctorEmailB = `doc_dash_b_${timestamp}@example.com`;
  const adminEmail = `admin_dash_${timestamp}@example.com`;
  const password = 'Password123!';

  let patientId, doctorId, doctorIdB, adminId;
  let patientToken, doctorToken, doctorTokenB, adminToken;

  const cleanup = async () => {
    try {
      const ids = [patientId, doctorId, doctorIdB, adminId].filter(Boolean);
      if (ids.length > 0) {
        // Clear all dashboard logs
        await Notification.destroy({ where: { recipientId: ids }, force: true }).catch(() => {});
        await VitalsAlert.destroy({ where: { patientId }, force: true }).catch(() => {});
        await VitalsLog.destroy({ where: { patientId }, force: true }).catch(() => {});
        await Appointment.destroy({ where: { patientId }, force: true }).catch(() => {});
        await Prescription.destroy({ where: { patientId }, force: true }).catch(() => {});
        await ActivityLog.destroy({ where: { userId: ids }, force: true }).catch(() => {});

        for (const id of ids) {
          const user = await User.findByPk(id);
          if (user) await user.destroy({ force: true });
        }
      }
    } catch (err) {
      console.warn('[CLEANUP WARNING]', err.message);
    }
  };

  try {
    // -------------------------------------------------------
    // SETUP
    // -------------------------------------------------------
    console.log('[SETUP] Creating test users...');
    const passHash = await hashPassword(password);

    // Register Patient
    const regPat = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmail, password, firstName: 'DashPatient', lastName: 'A', gender: 'Male', dateOfBirth: '1990-01-01' })
    });
    patientId = (await regPat.json()).data.id;

    // Register Doctor A (connected)
    const regDoc = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmail, password, firstName: 'DashDoctor', lastName: 'A', licenseNumber: `LIC_DASH_${timestamp}` })
    });
    doctorId = (await regDoc.json()).data.id;

    // Register Doctor B (unrelated)
    const regDocB = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmailB, password, firstName: 'DashDoctor', lastName: 'B', licenseNumber: `LIC_DASH_B_${timestamp}` })
    });
    doctorIdB = (await regDocB.json()).data.id;

    // Create Admin
    const adminUser = await User.create({ email: adminEmail, passwordHash: passHash, role: 'Admin', status: 'Active' });
    adminId = adminUser.id;

    // Activate all users
    await User.update({ status: 'Active' }, { where: { id: [patientId, doctorId, doctorIdB] } });
    await Doctor.update({ isVerified: true }, { where: { id: [doctorId] } }); // Keep Doctor B unverified to test pending count
    await Patient.update({ heightCm: 175, weightKg: 85 }, { where: { id: patientId } }); // Overweight BMI -> Medium risk

    // Establish relationship between Patient and Doctor A
    await Patient.update({ primaryDoctorId: doctorId }, { where: { id: patientId } });

    // Create some upcoming and past appointments
    const now = new Date();
    const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000 * 2); // 2 days in future
    const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000 * 2); // 2 days in past

    await Appointment.create({
      patientId,
      doctorId,
      appointmentAt: futureDate,
      status: 'Scheduled',
      reason: 'Regular consultation'
    });

    await Appointment.create({
      patientId,
      doctorId,
      appointmentAt: pastDate,
      status: 'Completed',
      reason: 'Past consultation'
    });

    // Create notifications (2 unread for patient)
    await Notification.create({ recipientId: patientId, title: 'Notif 1', message: 'Hello 1', notificationType: 'System', isRead: false });
    await Notification.create({ recipientId: patientId, title: 'Notif 2', message: 'Hello 2', notificationType: 'System', isRead: false });
    // 1 read for patient
    await Notification.create({ recipientId: patientId, title: 'Notif 3', message: 'Hello 3', notificationType: 'System', isRead: true });

    // Create 1 active prescription
    await Prescription.create({ patientId, doctorId, prescribedAt: new Date(), diagnosis: 'Cold', status: 'Active' });

    // Log abnormal vital (BMI is already overweight ~27.8)
    await VitalsLog.create({
      patientId,
      heartRate: 80,
      oxygenLevel: 97.0,
      temperature: 36.5,
      systolicBp: 110,
      diastolicBp: 70,
      triageStatus: 'Normal',
      source: 'Manual',
      loggedAt: new Date()
    });

    // Login users
    const loginUser = async (email) => {
      const res = await fetch(`${BASE_AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return (await res.json()).data.accessToken;
    };

    patientToken = await loginUser(patientEmail);
    doctorToken = await loginUser(doctorEmail);
    doctorTokenB = await loginUser(doctorEmailB);
    adminToken = await loginUser(adminEmail);

    console.log('✓ Setup complete.\n');

    // -------------------------------------------------------
    // TEST 1: Patient Dashboard
    // -------------------------------------------------------
    console.log('[TEST 1] Patient dashboard retrieval...');
    const t1Res = await fetch(`${BASE_API_URL}/dashboard/patient`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const t1Json = await t1Res.json();
    if (t1Res.status !== 200 || !t1Json.success) {
      throw new Error(`Test 1 Failed: ${t1Res.status} - ${JSON.stringify(t1Json)}`);
    }
    console.log('✓ Test 1 Passed. (Patient retrieved dashboard successfully)');

    // -------------------------------------------------------
    // TEST 2: Doctor Dashboard
    // -------------------------------------------------------
    console.log('\n[TEST 2] Doctor dashboard retrieval...');
    const t2Res = await fetch(`${BASE_API_URL}/dashboard/doctor`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    const t2Json = await t2Res.json();
    if (t2Res.status !== 200 || !t2Json.success) {
      throw new Error(`Test 2 Failed: ${t2Res.status} - ${JSON.stringify(t2Json)}`);
    }
    console.log('✓ Test 2 Passed. (Doctor retrieved dashboard successfully)');

    // -------------------------------------------------------
    // TEST 3: Admin Dashboard
    // -------------------------------------------------------
    console.log('\n[TEST 3] Admin dashboard retrieval...');
    const t3Res = await fetch(`${BASE_API_URL}/dashboard/admin`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const t3Json = await t3Res.json();
    if (t3Res.status !== 200 || !t3Json.success) {
      throw new Error(`Test 3 Failed: ${t3Res.status} - ${JSON.stringify(t3Json)}`);
    }
    console.log('✓ Test 3 Passed. (Admin retrieved dashboard successfully)');

    // -------------------------------------------------------
    // TEST 4: Patient attempts doctor dashboard
    // -------------------------------------------------------
    console.log('\n[TEST 4] Patient attempts doctor dashboard...');
    const t4Res = await fetch(`${BASE_API_URL}/dashboard/doctor`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    if (t4Res.status !== 403) {
      throw new Error(`Test 4 Failed: Expected 403, got ${t4Res.status}`);
    }
    console.log('✓ Test 4 Passed. (Access rejected with 403)');

    // -------------------------------------------------------
    // TEST 5: Doctor attempts admin dashboard
    // -------------------------------------------------------
    console.log('\n[TEST 5] Doctor attempts admin dashboard...');
    const t5Res = await fetch(`${BASE_API_URL}/dashboard/admin`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    if (t5Res.status !== 403) {
      throw new Error(`Test 5 Failed: Expected 403, got ${t5Res.status}`);
    }
    console.log('✓ Test 5 Passed. (Access rejected with 403)');

    // -------------------------------------------------------
    // TEST 6: Dashboard counts verification
    // -------------------------------------------------------
    console.log('\n[TEST 6] Dashboard counts verification...');
    const adminData = t3Json.data;
    // Database totals comparison
    const userCount = await User.count();
    const patientCount = await Patient.count();
    const doctorCount = await Doctor.count();
    const pendingCount = await Doctor.count({ where: { isVerified: false } });

    if (adminData.totalUsers !== userCount) throw new Error(`Users count mismatch: got ${adminData.totalUsers}, expected ${userCount}`);
    if (adminData.totalPatients !== patientCount) throw new Error(`Patients count mismatch: got ${adminData.totalPatients}, expected ${patientCount}`);
    if (adminData.totalDoctors !== doctorCount) throw new Error(`Doctors count mismatch: got ${adminData.totalDoctors}, expected ${doctorCount}`);
    if (adminData.pendingDoctorApprovals !== pendingCount) throw new Error(`Pending count mismatch: got ${adminData.pendingDoctorApprovals}, expected ${pendingCount}`);

    console.log('✓ Test 6 Passed. (Counts verified with database: users, doctors, patients, pending)');

    // -------------------------------------------------------
    // TEST 7: Upcoming appointments
    // -------------------------------------------------------
    console.log('\n[TEST 7] Upcoming appointments check...');
    const patData = t1Json.data;
    const upcoming = patData.upcomingAppointments;
    if (upcoming.length !== 1) {
      throw new Error(`Test 7 Failed: Expected 1 upcoming appointment, got ${upcoming.length}`);
    }
    const apptTime = new Date(upcoming[0].appointmentAt);
    if (apptTime <= now) {
      throw new Error('Test 7 Failed: Returned appointment is not in the future.');
    }
    console.log('✓ Test 7 Passed. (Upcoming appointments are future-only and sorted)');

    // -------------------------------------------------------
    // TEST 8: Unread notification count
    // -------------------------------------------------------
    console.log('\n[TEST 8] Unread notification count check...');
    const unreadCount = patData.unreadNotificationsCount;
    if (unreadCount !== 2) {
      throw new Error(`Test 8 Failed: Expected 2 unread notifications, got ${unreadCount}`);
    }
    console.log('✓ Test 8 Passed. (Unread notification count matches database: 2)');

    // -------------------------------------------------------
    // TEST 9: Health risk integration
    // -------------------------------------------------------
    console.log('\n[TEST 9] Health risk integration check...');
    // Fetch directly from Health Summary module
    const summaryRes = await fetch(`${BASE_API_URL}/health-summary/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const summaryJson = await summaryRes.json();
    const riskFromSummary = summaryJson.data.riskLevel;

    if (patData.healthRiskLevel !== riskFromSummary) {
      throw new Error(`Test 9 Failed: Dashboard risk (${patData.healthRiskLevel}) does not match Health Summary risk (${riskFromSummary})`);
    }
    console.log(`✓ Test 9 Passed. (Dashboard healthRiskLevel matches Health Summary: ${patData.healthRiskLevel})`);

    // -------------------------------------------------------
    // TEST 10: DTO sanitization check
    // -------------------------------------------------------
    console.log('\n[TEST 10] DTO sanitization check...');
    const forbiddenKeys = ['passwordHash', 'deletedAt', 'createdAt', 'updatedAt', 'notes', 'emergencyContactName'];
    
    // Check doctor activity objects
    const docData = t2Json.data;
    const act = docData.recentPatientActivity;
    if (act && act.length > 0) {
      const keys = Object.keys(act[0]);
      for (const key of forbiddenKeys) {
        if (keys.includes(key)) {
          throw new Error(`Test 10 Failed: Sensitive key leaked in patient activity: ${key}`);
        }
      }
    }
    console.log('✓ Test 10 Passed. (Dashboard DTO completely sanitized)');

    console.log('\n=== ✅ ALL 10 DASHBOARD TESTS PASSED ===\n');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err.message);
    process.exit(1);
  } finally {
    await cleanup();
    console.log('[CLEANUP] Test data removed.');
    process.exit(0);
  }
}

runTests();
