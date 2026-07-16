const { User, RefreshToken, Doctor, Patient, Appointment, ActivityLog } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');
const appointmentService = require('../appointment/services/appointment.service');

delete process.env.PORT;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const port = process.env.PORT || 5000;
const BASE_API_URL = `http://localhost:${port}/api/v1`;
const BASE_AUTH_URL = `http://localhost:${port}/api/auth`;

async function runTests() {
  console.log('=== Starting Appointment Management Verification Tests ===');

  const timestamp = Date.now();
  const patientEmailA = `patient_a_ap_${timestamp}@example.com`;
  const patientEmailB = `patient_b_ap_${timestamp}@example.com`;
  const doctorEmail = `doctor_ap_${timestamp}@example.com`;
  const adminEmail = `admin_ap_${timestamp}@example.com`;
  const password = 'Password123!';

  let patientIdA, patientIdB, doctorId, adminId;
  let patientAccessTokenA, patientAccessTokenB, doctorAccessToken, adminAccessToken;

  try {
    // ----------------------------------------------------
    // Setup Admin, Patient, Doctor users in database
    // ----------------------------------------------------
    console.log('\n[SETUP] Creating test users...');
    const passHash = await hashPassword(password);

    // Register Patient A
    const regResA = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: patientEmailA, password, firstName: 'PatientA', lastName: 'Test', gender: 'Male', dateOfBirth: '1990-01-01'
      })
    });
    patientIdA = (await regResA.json()).data.id;

    // Login Patient A
    const loginA = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmailA, password })
    });
    patientAccessTokenA = (await loginA.json()).data.accessToken;

    // Register Patient B
    const regResB = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: patientEmailB, password, firstName: 'PatientB', lastName: 'Test', gender: 'Female', dateOfBirth: '1992-02-02'
      })
    });
    patientIdB = (await regResB.json()).data.id;

    // Login Patient B
    const loginB = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmailB, password })
    });
    patientAccessTokenB = (await loginB.json()).data.accessToken;

    // Register Doctor (Verified + Active)
    const regDoc = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: doctorEmail, password, firstName: 'DrSarah', lastName: 'Test', licenseNumber: `LIC_AP_${timestamp}`
      })
    });
    doctorId = (await regDoc.json()).data.id;
    await User.update({ status: 'Active' }, { where: { id: doctorId } });
    await Doctor.update({ isVerified: true }, { where: { id: doctorId } });

    // Login Doctor
    const loginDoc = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmail, password })
    });
    doctorAccessToken = (await loginDoc.json()).data.accessToken;

    // Create Admin
    const adminUser = await User.create({
      email: adminEmail, passwordHash: passHash, role: 'Admin', status: 'Active'
    });
    adminId = adminUser.id;

    // Login Admin
    const loginAdmin = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password })
    });
    adminAccessToken = (await loginAdmin.json()).data.accessToken;

    console.log('✓ Setup complete.');

    // Time definitions
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2); // 2 days in the future
    futureDate.setHours(10, 0, 0, 0); // 10:00 AM
    const scheduledStr = futureDate.toISOString();

    // ----------------------------------------------------
    // Test 1: Patient books appointment
    // ----------------------------------------------------
    console.log('\n[TEST 1] Patient A booking an appointment (POST /appointments)...');
    const t1Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patientAccessTokenA}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        doctorId,
        scheduledAt: scheduledStr,
        reason: 'Regular general checkup'
      })
    });
    const t1Json = await t1Res.json();
    console.log('Status:', t1Res.status);
    console.log('Data details:', t1Json.data);
    
    if (t1Res.status !== 201 || t1Json.data.status !== 'Pending') {
      throw new Error('Test 1 Failed');
    }
    const appointmentId = t1Json.data.appointmentId;
    console.log('✓ Test 1 Passed.');

    // ----------------------------------------------------
    // Test 2: Double booking overlap check (409 Conflict)
    // ----------------------------------------------------
    console.log('\n[TEST 2] Patient B booking overlap slot with doctor...');
    const t2Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patientAccessTokenB}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        doctorId,
        scheduledAt: scheduledStr,
        reason: 'Overlapping consult request'
      })
    });
    const t2Json = await t2Res.json();
    console.log('Status:', t2Res.status);
    console.log('Message:', t2Json.message);

    if (t2Res.status !== 409 || t2Json.message !== 'Doctor is unavailable for the selected time slot.') {
      throw new Error('Test 2 Failed: Overlapping check did not restrict double booking');
    }
    console.log('✓ Test 2 Passed.');

    // ----------------------------------------------------
    // Test 3: Booking in past
    // ----------------------------------------------------
    console.log('\n[TEST 3] Booking an appointment in the past...');
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday

    const t3Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patientAccessTokenA}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        doctorId,
        scheduledAt: pastDate.toISOString(),
        reason: 'Past consult'
      })
    });
    const t3Json = await t3Res.json();
    console.log('Status:', t3Res.status);
    console.log('Message:', t3Json.message);

    if (t3Res.status !== 400) {
      throw new Error('Test 3 Failed: Past booking allowed');
    }
    console.log('✓ Test 3 Passed.');

    // ----------------------------------------------------
    // Test 4: Patient views own appointments
    // ----------------------------------------------------
    console.log('\n[TEST 4] Patient A retrieving own bookings (GET /appointments/me)...');
    const t4Res = await fetch(`${BASE_API_URL}/appointments/me`, {
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}` }
    });
    const t4Json = await t4Res.json();
    console.log('Status:', t4Res.status);
    console.log('List Count:', t4Json.data.length);
    console.log('DTO keys:', Object.keys(t4Json.data[0]));

    if (t4Res.status !== 200 || t4Json.data.length !== 1) {
      throw new Error('Test 4 Failed');
    }
    console.log('✓ Test 4 Passed.');

    // ----------------------------------------------------
    // Test 5: Doctor views own appointments
    // ----------------------------------------------------
    console.log('\n[TEST 5] Doctor Sarah retrieving own schedule (GET /appointments/doctor)...');
    const t5Res = await fetch(`${BASE_API_URL}/appointments/doctor`, {
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t5Json = await t5Res.json();
    console.log('Status:', t5Res.status);
    console.log('Doctor Schedule list:', t5Json.data.length);
    console.log('Doctor DTO keys:', Object.keys(t5Json.data[0]));

    if (t5Res.status !== 200 || t5Json.data.length !== 1) {
      throw new Error('Test 5 Failed');
    }
    console.log('✓ Test 5 Passed.');

    // ----------------------------------------------------
    // Test 6: Patient attempts to cancel another patient's appointment (Expect 403)
    // ----------------------------------------------------
    console.log('\n[TEST 6] Patient B attempting to cancel Patient A\'s appointment (Expect 403)...');
    const t6Res = await fetch(`${BASE_API_URL}/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${patientAccessTokenB}` }
    });
    const t6Json = await t6Res.json();
    console.log('Status:', t6Res.status);
    console.log('Message:', t6Json.message);

    if (t6Res.status !== 403 || t6Json.message !== 'You are not authorized to cancel this appointment.') {
      throw new Error('Test 6 Failed');
    }
    console.log('✓ Test 6 Passed.');

    // ----------------------------------------------------
    // Test 7: Doctor confirms appointment
    // ----------------------------------------------------
    console.log('\n[TEST 7] Doctor confirming Patient A\'s appointment (PATCH /status -> Confirmed)...');
    const t7Res = await fetch(`${BASE_API_URL}/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'Confirmed' })
    });
    const t7Json = await t7Res.json();
    console.log('Status:', t7Res.status);
    console.log('DTO Updated Status:', t7Json.data.status);

    // Verify DB
    const dbAppConf = await Appointment.findByPk(appointmentId);
    console.log('DB Updated Status:', dbAppConf.status);

    if (t7Res.status !== 200 || dbAppConf.status !== 'Confirmed') {
      throw new Error('Test 7 Failed');
    }
    
    // Verify Activity Log exists for confirmation
    const confLog = await ActivityLog.findOne({ where: { entityId: appointmentId, action: 'APPOINTMENT_CONFIRMED' } });
    console.log('Activity log action for confirm exists:', !!confLog);
    if (!confLog) {
      throw new Error('Test 7 Failed: No log written for appointment confirmation');
    }
    console.log('✓ Test 7 Passed.');

    // ----------------------------------------------------
    // Test 8: Doctor completes appointment
    // ----------------------------------------------------
    console.log('\n[TEST 8] Doctor completing the appointment (PATCH /status -> Completed)...');
    const t8Res = await fetch(`${BASE_API_URL}/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'Completed' })
    });
    const t8Json = await t8Res.json();
    console.log('Status:', t8Res.status);
    console.log('DTO Updated Status:', t8Json.data.status);

    const dbAppComp = await Appointment.findByPk(appointmentId);
    if (t8Res.status !== 200 || dbAppComp.status !== 'Completed') {
      throw new Error('Test 8 Failed');
    }
    console.log('✓ Test 8 Passed.');

    // ----------------------------------------------------
    // Test 9: Attempt invalid transition (Completed -> Pending)
    // ----------------------------------------------------
    console.log('\n[TEST 9] Attempting invalid transition (Completed -> Pending)...');
    const t9Res = await fetch(`${BASE_API_URL}/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'Pending' })
    });
    const t9Json = await t9Res.json();
    console.log('Status:', t9Res.status);
    console.log('Message:', t9Json.message);

    if (t9Res.status !== 400) {
      throw new Error('Test 9 Failed: Invalid state change was not blocked');
    }
    console.log('✓ Test 9 Passed.');

    // ----------------------------------------------------
    // Test 10: Patient cancels appointment
    // ----------------------------------------------------
    console.log('\n[TEST 10] Testing cancellation workflow (booking a new one first)...');
    // Book a second appointment for Patient A
    const booking2Str = new Date(futureDate.getTime() + 60 * 60 * 1000).toISOString(); // 1 hour later
    const book2Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patientAccessTokenA}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ doctorId, scheduledAt: booking2Str, reason: 'Followup check' })
    });
    const app2Id = (await book2Res.json()).data.appointmentId;

    // Patient cancels
    const cancelRes = await fetch(`${BASE_API_URL}/appointments/${app2Id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}` }
    });
    const cancelJson = await cancelRes.json();
    console.log('Cancellation response status:', cancelRes.status);
    console.log('DTO Cancelled Status:', cancelJson.data.status);

    const dbAppCanc = await Appointment.findByPk(app2Id);
    console.log('DB Cancelled Status:', dbAppCanc.status);

    if (cancelRes.status !== 200 || dbAppCanc.status !== 'Cancelled') {
      throw new Error('Test 10 Failed: Cancellation failed');
    }
    console.log('✓ Test 10 Passed.');

    // ----------------------------------------------------
    // Test 11: Admin retrieves all appointments
    // ----------------------------------------------------
    console.log('\n[TEST 11] Admin retrieving all paginated bookings (GET /appointments/admin)...');
    const t11Res = await fetch(`${BASE_API_URL}/appointments/admin?limit=5&page=1`, {
      headers: { 'Authorization': `Bearer ${adminAccessToken}` }
    });
    const t11Json = await t11Res.json();
    console.log('Status:', t11Res.status);
    console.log('Admin Pagination metadata:', t11Json.data.pagination);
    console.log('Admin Result array size:', t11Json.data.appointments.length);

    if (t11Res.status !== 200 || !t11Json.data.pagination) {
      throw new Error('Test 11 Failed');
    }
    console.log('✓ Test 11 Passed.');

    // ----------------------------------------------------
    // Test 12: Transaction rollback
    // ----------------------------------------------------
    console.log('\n[TEST 12] Testing transaction rollback by bypass-calling service with db ENUM violation...');
    // Empty logs first
    await ActivityLog.destroy({ where: { entity: 'Appointment' } });

    // Directly call service with an invalid status values to force db check failure
    let dbFailThrown = false;
    try {
      await appointmentService.updateAppointmentStatus(doctorId, appointmentId, 'InvalidStatusBypassingValidation');
    } catch (e) {
      dbFailThrown = true;
      console.log('Service threw database ENUM constraint error:', e.message);
    }

    // Verify appointment state remains unchanged (Completed)
    const dbAppAfterFail = await Appointment.findByPk(appointmentId);
    console.log('Appointment status after database failure:', dbAppAfterFail.status);

    // Verify no activity log was written
    const logsAfterFail = await ActivityLog.findAll({ where: { entityId: appointmentId } });
    console.log('Activity logs count after failure:', logsAfterFail.length);

    if (!dbFailThrown) {
      throw new Error('Test 12 Failed: Update status did not fail on database value violation');
    }
    if (dbAppAfterFail.status !== 'Completed') {
      throw new Error('Test 12 Failed: Database status was updated, transaction rollback failed!');
    }
    if (logsAfterFail.length !== 0) {
      throw new Error('Test 12 Failed: Activity log written for failed transaction');
    }
    console.log('✓ Test 12 Passed.');

    console.log('\n=== ALL APPOINTMENT MANAGEMENT MODULE TESTS PASSED! ===');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    console.log('\nCleaning up database test records...');
    try {
      // Delete appointments created
      await Appointment.destroy({ where: { patientId: [patientIdA, patientIdB] }, force: true });

      if (patientIdA) {
        await RefreshToken.destroy({ where: { userId: patientIdA } });
        await Patient.destroy({ where: { id: patientIdA }, force: true });
        await User.destroy({ where: { id: patientIdA }, force: true });
      }
      if (patientIdB) {
        await RefreshToken.destroy({ where: { userId: patientIdB } });
        await Patient.destroy({ where: { id: patientIdB }, force: true });
        await User.destroy({ where: { id: patientIdB }, force: true });
      }
      if (doctorId) {
        await Doctor.destroy({ where: { id: doctorId }, force: true });
        await User.destroy({ where: { id: doctorId }, force: true });
      }
      if (adminId) {
        await User.destroy({ where: { id: adminId }, force: true });
      }
      console.log('✓ Cleanup complete.');
    } catch (cleanupErr) {
      console.error('Failed to clean up:', cleanupErr.message);
    }
    process.exit(0);
  }
}

setTimeout(runTests, 1000);
