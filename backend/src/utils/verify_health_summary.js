const { User, Doctor, Patient, VitalsLog, VitalsAlert, Appointment, Prescription, DoctorNote, ActivityLog } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');

const BASE_API_URL = 'http://localhost:5000/api/v1';
const BASE_AUTH_URL = 'http://localhost:5000/api/auth';

async function runTests() {
  console.log('=== Starting AI Health Summary & Risk Assessment Verification Tests (Phase 5.10) ===\n');

  const timestamp = Date.now();
  const patientEmail = `pat_sum_${timestamp}@example.com`;
  const doctorEmail = `doc_sum_${timestamp}@example.com`;
  const doctorEmailB = `doc_sum_b_${timestamp}@example.com`;
  const adminEmail = `admin_sum_${timestamp}@example.com`;
  const password = 'Password123!';

  let patientId, doctorId, doctorIdB, adminId;
  let patientToken, doctorToken, doctorTokenB, adminToken;

  const cleanup = async () => {
    try {
      const ids = [patientId, doctorId, doctorIdB, adminId].filter(Boolean);
      if (ids.length > 0) {
        // Clear E2E records
        await VitalsAlert.destroy({ where: { patientId }, force: true }).catch(() => {});
        await VitalsLog.destroy({ where: { patientId }, force: true }).catch(() => {});
        await Appointment.destroy({ where: { patientId }, force: true }).catch(() => {});
        await Prescription.destroy({ where: { patientId }, force: true }).catch(() => {});
        await DoctorNote.destroy({ where: { patientId }, force: true }).catch(() => {});
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

    // Register Patient (Patient height = 180cm, weight = 70kg -> healthy BMI ~21.6)
    const regPat = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmail, password, firstName: 'SumPatient', lastName: 'A', gender: 'Male', dateOfBirth: '1990-01-01' })
    });
    patientId = (await regPat.json()).data.id;

    // Register Doctor A (connected)
    const regDoc = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmail, password, firstName: 'SumDoctor', lastName: 'A', licenseNumber: `LIC_SUM_${timestamp}` })
    });
    doctorId = (await regDoc.json()).data.id;

    // Register Doctor B (unrelated/unauthorized)
    const regDocB = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmailB, password, firstName: 'SumDoctor', lastName: 'B', licenseNumber: `LIC_SUM_B_${timestamp}` })
    });
    doctorIdB = (await regDocB.json()).data.id;

    // Create Admin
    const adminUser = await User.create({ email: adminEmail, passwordHash: passHash, role: 'Admin', status: 'Active' });
    adminId = adminUser.id;

    // Activate all users
    await User.update({ status: 'Active' }, { where: { id: [patientId, doctorId, doctorIdB] } });
    await Doctor.update({ isVerified: true }, { where: { id: [doctorId, doctorIdB] } });
    await Patient.update({ heightCm: 180, weightKg: 70 }, { where: { id: patientId } });

    // Establish relationship between Patient and Doctor A
    await Patient.update({ primaryDoctorId: doctorId }, { where: { id: patientId } });

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
    // TEST 1: Patient retrieves own summary
    // -------------------------------------------------------
    console.log('[TEST 1] Patient retrieves own summary...');
    const t1Res = await fetch(`${BASE_API_URL}/health-summary/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const t1Json = await t1Res.json();
    if (t1Res.status !== 200 || !t1Json.success) {
      throw new Error(`Test 1 Failed: ${t1Res.status} - ${JSON.stringify(t1Json)}`);
    }
    console.log('✓ Test 1 Passed. (Patient retrieved own summary successfully)');

    // -------------------------------------------------------
    // TEST 2: Doctor retrieves assigned patient's summary
    // -------------------------------------------------------
    console.log('\n[TEST 2] Doctor retrieves connected patient\'s summary...');
    const t2Res = await fetch(`${BASE_API_URL}/health-summary/patient/${patientId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    const t2Json = await t2Res.json();
    if (t2Res.status !== 200 || !t2Json.success) {
      throw new Error(`Test 2 Failed: ${t2Res.status} - ${JSON.stringify(t2Json)}`);
    }
    console.log('✓ Test 2 Passed. (Connected doctor retrieved summary successfully)');

    // -------------------------------------------------------
    // TEST 3: Doctor retrieves unrelated patient's summary
    // -------------------------------------------------------
    console.log('\n[TEST 3] Doctor retrieves unrelated patient\'s summary...');
    const t3Res = await fetch(`${BASE_API_URL}/health-summary/patient/${patientId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doctorTokenB}` }
    });
    if (t3Res.status !== 403) {
      throw new Error(`Test 3 Failed: Unrelated doctor should get 403, got ${t3Res.status}`);
    }
    console.log('✓ Test 3 Passed. (Access rejected with 403 Forbidden)');

    // -------------------------------------------------------
    // TEST 4: Admin retrieves any patient's summary
    // -------------------------------------------------------
    console.log('\n[TEST 4] Admin retrieves any patient\'s summary...');
    const t4Res = await fetch(`${BASE_API_URL}/health-summary/patient/${patientId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const t4Json = await t4Res.json();
    if (t4Res.status !== 200 || !t4Json.success) {
      throw new Error(`Test 4 Failed: Admin should get 200, got ${t4Res.status}`);
    }
    console.log('✓ Test 4 Passed. (Admin retrieved summary successfully)');

    // -------------------------------------------------------
    // TEST 5: Low Risk assessment
    // -------------------------------------------------------
    console.log('\n[TEST 5] Low Risk assessment verification...');
    // Log perfectly healthy vitals
    await VitalsLog.create({
      patientId,
      heartRate: 75,
      oxygenLevel: 98.0,
      temperature: 36.6,
      systolicBp: 115,
      diastolicBp: 75,
      bloodGlucoseMgdl: 90.0,
      triageStatus: 'Normal',
      source: 'Manual',
      loggedAt: new Date()
    });

    const t5Res = await fetch(`${BASE_API_URL}/health-summary/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const t5Json = await t5Res.json();
    if (t5Json.data.riskLevel !== 'LOW') {
      throw new Error(`Test 5 Failed: Expected LOW risk, got ${t5Json.data.riskLevel}. Factors: ${t5Json.data.riskFactors}`);
    }
    console.log('✓ Test 5 Passed. (Risk Level is LOW)');

    // -------------------------------------------------------
    // TEST 6: Medium Risk assessment
    // -------------------------------------------------------
    console.log('\n[TEST 6] Medium Risk assessment verification...');
    // Update patient profile to Overweight BMI (height = 180cm, weight = 85kg -> BMI ~26.2)
    await Patient.update({ weightKg: 85 }, { where: { id: patientId } });

    const t6Res = await fetch(`${BASE_API_URL}/health-summary/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const t6Json = await t6Res.json();
    if (t6Json.data.riskLevel !== 'MEDIUM') {
      throw new Error(`Test 6 Failed: Expected MEDIUM risk, got ${t6Json.data.riskLevel}. Factors: ${t6Json.data.riskFactors}`);
    }
    console.log('✓ Test 6 Passed. (Risk Level is MEDIUM due to overweight BMI)');

    // -------------------------------------------------------
    // TEST 7: High Risk assessment
    // -------------------------------------------------------
    console.log('\n[TEST 7] High Risk assessment verification...');
    // Log abnormal critical SpO2 (88%)
    await VitalsLog.create({
      patientId,
      heartRate: 110,
      oxygenLevel: 88.0,
      temperature: 38.5,
      systolicBp: 150,
      diastolicBp: 95,
      triageStatus: 'Critical',
      source: 'Manual',
      loggedAt: new Date()
    });

    const t7Res = await fetch(`${BASE_API_URL}/health-summary/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const t7Json = await t7Res.json();
    if (t7Json.data.riskLevel !== 'HIGH') {
      throw new Error(`Test 7 Failed: Expected HIGH risk, got ${t7Json.data.riskLevel}. Factors: ${t7Json.data.riskFactors}`);
    }
    console.log('✓ Test 7 Passed. (Risk Level is HIGH due to critical SpO2 and multiple abnormal indicators)');

    // -------------------------------------------------------
    // TEST 8: Recommendation engine
    // -------------------------------------------------------
    console.log('\n[TEST 8] Recommendation engine verification...');
    const recs = t7Json.data.recommendations;
    if (!recs.includes('Seek immediate medical attention.')) {
      throw new Error(`Test 8 Failed: Expected SpO2 alert recommendation, got: ${recs}`);
    }
    if (!recs.includes('Schedule doctor consultation.')) {
      throw new Error(`Test 8 Failed: Expected blood pressure consultation recommendation, got: ${recs}`);
    }
    console.log(`✓ Test 8 Passed. (Recommendations generated: [${recs.join(', ')}])`);

    // -------------------------------------------------------
    // TEST 9: DTO sanitization
    // -------------------------------------------------------
    console.log('\n[TEST 9] DTO sanitization check...');
    const keys = Object.keys(t7Json.data);
    const forbiddenKeys = ['passwordHash', 'deletedAt', 'noteContent', 'patient_id', 'doctor_id'];
    for (const key of forbiddenKeys) {
      if (keys.includes(key)) {
        throw new Error(`Test 9 Failed: Sensitive key leaked in top-level payload: ${key}`);
      }
    }
    const patientKeys = Object.keys(t7Json.data.patient);
    for (const key of forbiddenKeys) {
      if (patientKeys.includes(key)) {
        throw new Error(`Test 9 Failed: Sensitive key leaked in patient sub-object: ${key}`);
      }
    }
    console.log('✓ Test 9 Passed. (DTO properly sanitized, no sensitive parameters leaked)');

    // -------------------------------------------------------
    // TEST 10: Patient without vitals
    // -------------------------------------------------------
    console.log('\n[TEST 10] Patient without vitals check...');
    // Create new patient with no vitals logs
    const tempEmail = `pat_empty_${timestamp}@example.com`;
    const regPatEmpty = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: tempEmail, password, firstName: 'EmptyPat', lastName: 'A', gender: 'Female', dateOfBirth: '1995-10-10' })
    });
    const emptyPatId = (await regPatEmpty.json()).data.id;
    await User.update({ status: 'Active' }, { where: { id: emptyPatId } });

    const emptyToken = await loginUser(tempEmail);

    const t10Res = await fetch(`${BASE_API_URL}/health-summary/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${emptyToken}` }
    });
    const t10Json = await t10Res.json();
    if (t10Res.status !== 200 || !t10Json.success) {
      throw new Error(`Test 10 Failed: ${t10Res.status} - ${JSON.stringify(t10Json)}`);
    }
    if (t10Json.data.latestVitals !== null) {
      throw new Error('Test 10 Failed: Vitals should be null.');
    }
    if (t10Json.data.riskLevel !== 'LOW') {
      throw new Error(`Test 10 Failed: Risk level should default to LOW, got ${t10Json.data.riskLevel}`);
    }

    // Clean up empty patient
    const userToClean = await User.findByPk(emptyPatId);
    if (userToClean) await userToClean.destroy({ force: true });

    console.log('✓ Test 10 Passed. (Empty vitals record successfully defaults to LOW and returns empty DTO)');

    console.log('\n=== ✅ ALL 10 HEALTH SUMMARY TESTS PASSED ===\n');

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
