const { User, RefreshToken, Doctor, Patient, DoctorAvailability, Appointment, ActivityLog } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');
const availabilityService = require('../availability/services/availability.service');

delete process.env.PORT;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const port = process.env.PORT || 5000;
const BASE_API_URL = `http://localhost:${port}/api/v1`;
const BASE_AUTH_URL = `http://localhost:${port}/api/auth`;

async function runTests() {
  console.log('=== Starting Phase 5.6 Doctor Availability Verification Tests ===');

  const timestamp = Date.now();
  const patientEmail = `patient_av_${timestamp}@example.com`;
  const doctorEmail = `doctor_av_${timestamp}@example.com`;
  const adminEmail = `admin_av_${timestamp}@example.com`;
  const password = 'Password123!';

  let patientId, doctorId, adminId;
  let patientAccessToken, doctorAccessToken, adminAccessToken;

  try {
    // ----------------------------------------------------
    // Setup Admin, Patient, Doctor users in database
    // ----------------------------------------------------
    console.log('\n[SETUP] Creating test users...');
    const passHash = await hashPassword(password);

    // Register Patient
    const regResP = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: patientEmail, password, firstName: 'PatientA', lastName: 'Test', gender: 'Male', dateOfBirth: '1990-01-01'
      })
    });
    patientId = (await regResP.json()).data.id;

    // Login Patient
    const loginP = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmail, password })
    });
    patientAccessToken = (await loginP.json()).data.accessToken;

    // Register Doctor (Unverified/Inactive first)
    const regDoc = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: doctorEmail, password, firstName: 'DrSarah', lastName: 'Test', licenseNumber: `LIC_AV_${timestamp}`
      })
    });
    doctorId = (await regDoc.json()).data.id;

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

    // ----------------------------------------------------
    // Test 9 (Pre-activation check): Patient requests unverified doctor (Expect 404)
    // ----------------------------------------------------
    console.log('\n[TEST 9] Patient requesting unverified doctor schedule (Expect 404)...');
    const t9Res = await fetch(`${BASE_API_URL}/availability/doctor/${doctorId}`, {
      headers: { 'Authorization': `Bearer ${patientAccessToken}` }
    });
    const t9Json = await t9Res.json();
    console.log('Status:', t9Res.status);
    console.log('Message:', t9Json.message);
    if (t9Res.status !== 404) {
      throw new Error('Test 9 Failed: Unverified doctor schedule allowed');
    }
    console.log('✓ Test 9 Passed.');

    // Activate & verify Doctor
    await User.update({ status: 'Active' }, { where: { id: doctorId } });
    await Doctor.update({ isVerified: true }, { where: { id: doctorId } });

    // Login Doctor to get access token
    const loginDoc = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmail, password })
    });
    doctorAccessToken = (await loginDoc.json()).data.accessToken;

    // ----------------------------------------------------
    // Test 1: Doctor creates availability
    // ----------------------------------------------------
    console.log('\n[TEST 1] Doctor creating availability slot (POST /availability)...');
    const t1Res = await fetch(`${BASE_API_URL}/availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '12:00'
      })
    });
    const t1Json = await t1Res.json();
    console.log('Status:', t1Res.status);
    console.log('Created slot ID:', t1Json.data.id);
    if (t1Res.status !== 201 || !t1Json.data.id) {
      throw new Error('Test 1 Failed');
    }
    const availabilityId1 = t1Json.data.id;
    console.log('✓ Test 1 Passed.');

    // ----------------------------------------------------
    // Test 2: Duplicate availability (Expect 409)
    // ----------------------------------------------------
    console.log('\n[TEST 2] Doctor creating exact duplicate availability (Expect 409)...');
    const t2Res = await fetch(`${BASE_API_URL}/availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '12:00'
      })
    });
    const t2Json = await t2Res.json();
    console.log('Status:', t2Res.status);
    console.log('Message:', t2Json.message);
    if (t2Res.status !== 409) {
      throw new Error('Test 2 Failed');
    }
    console.log('✓ Test 2 Passed.');

    // ----------------------------------------------------
    // Test 3: Overlapping availability (Expect 409)
    // ----------------------------------------------------
    console.log('\n[TEST 3] Doctor creating overlapping availability (10:00 - 13:00) (Expect 409)...');
    const t3Res = await fetch(`${BASE_API_URL}/availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dayOfWeek: 'Monday',
        startTime: '10:00',
        endTime: '13:00'
      })
    });
    console.log('Status:', t3Res.status);
    if (t3Res.status !== 409) {
      throw new Error('Test 3 Failed');
    }
    console.log('✓ Test 3 Passed.');

    // ----------------------------------------------------
    // Test 4: Invalid time range (end <= start) (Expect 400)
    // ----------------------------------------------------
    console.log('\n[TEST 4] Doctor creating slot with endTime before startTime (Expect 400)...');
    const t4Res = await fetch(`${BASE_API_URL}/availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dayOfWeek: 'Monday',
        startTime: '16:00',
        endTime: '15:00'
      })
    });
    console.log('Status:', t4Res.status);
    if (t4Res.status !== 400) {
      throw new Error('Test 4 Failed');
    }
    console.log('✓ Test 4 Passed.');

    // ----------------------------------------------------
    // Test 5: Doctor updates availability
    // ----------------------------------------------------
    console.log('\n[TEST 5] Doctor updating availability slot (PUT /availability/:id)...');
    const t5Res = await fetch(`${BASE_API_URL}/availability/${availabilityId1}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '11:00'
      })
    });
    const t5Json = await t5Res.json();
    console.log('Status:', t5Res.status);
    console.log('Updated startTime:', t5Json.data.startTime);

    const dbRecord = await DoctorAvailability.findByPk(availabilityId1);
    console.log('DB startTime:', dbRecord.startTime);

    if (t5Res.status !== 200 || dbRecord.startTime !== '08:00:00') {
      throw new Error('Test 5 Failed');
    }
    console.log('✓ Test 5 Passed.');

    // ----------------------------------------------------
    // Test 6: Update overlap exclusion (self-update test)
    // ----------------------------------------------------
    console.log('\n[TEST 6] Doctor self-updating slot to same times (Expect 200)...');
    const t6Res = await fetch(`${BASE_API_URL}/availability/${availabilityId1}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dayOfWeek: 'Monday',
        startTime: '08:00',
        endTime: '11:00'
      })
    });
    console.log('Status:', t6Res.status);
    if (t6Res.status !== 200) {
      throw new Error('Test 6 Failed');
    }
    console.log('✓ Test 6 Passed.');

    // ----------------------------------------------------
    // Test 7: Doctor disables availability
    // ----------------------------------------------------
    console.log('\n[TEST 7] Doctor disabling availability (PATCH /availability/:id/disable)...');
    const t7Res = await fetch(`${BASE_API_URL}/availability/${availabilityId1}/disable`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t7Json = await t7Res.json();
    console.log('Status:', t7Res.status);
    console.log('isAvailable value:', t7Json.data.isAvailable);

    const dbRecordDis = await DoctorAvailability.findByPk(availabilityId1);
    console.log('DB isAvailable value:', dbRecordDis.isAvailable);

    if (t7Res.status !== 200 || dbRecordDis.isAvailable !== false) {
      throw new Error('Test 7 Failed');
    }
    console.log('✓ Test 7 Passed.');

    // Re-enable for subsequent checks
    await DoctorAvailability.update({ isAvailable: true }, { where: { id: availabilityId1 } });

    // ----------------------------------------------------
    // Test 8: Patient requests doctor schedule (returns only enabled)
    // ----------------------------------------------------
    console.log('\n[TEST 8] Patient querying doctor schedule (GET /availability/doctor/:doctorId)...');
    // Create an extra disabled slot to verify it is filtered out
    await DoctorAvailability.create({
      doctorId,
      dayOfWeek: 2, // Tuesday
      startTime: '10:00:00',
      endTime: '12:00:00',
      isAvailable: false
    });

    const t8Res = await fetch(`${BASE_API_URL}/availability/doctor/${doctorId}`, {
      headers: { 'Authorization': `Bearer ${patientAccessToken}` }
    });
    const t8Json = await t8Res.json();
    console.log('Status:', t8Res.status);
    console.log('Schedule list size:', t8Json.data.length);
    console.log('Returned slots:', t8Json.data);

    if (t8Res.status !== 200 || t8Json.data.length !== 1 || t8Json.data[0].dayOfWeek !== 'Monday') {
      throw new Error('Test 8 Failed');
    }
    console.log('✓ Test 8 Passed.');

    // ----------------------------------------------------
    // Test 11: Doctor deletes availability linked to future appointment (Expect 409)
    // ----------------------------------------------------
    console.log('\n[TEST 11] Doctor deleting slot linked to future appointment (Expect 409)...');
    // Get target Monday date in the future
    const targetMonday = new Date();
    targetMonday.setDate(targetMonday.getDate() + ((1 + 7 - targetMonday.getDay()) % 7 || 7)); // Next Monday
    targetMonday.setUTCHours(9, 0, 0, 0); // 09:00 AM UTC

    // Book future appointment overlapping Monday slot (Monday 08:00 - 11:00)
    const futureApp = await Appointment.create({
      patientId: patientId,
      doctorId,
      appointmentAt: targetMonday, // Next Monday at 09:00
      status: 'Scheduled',
      durationMinutes: 30
    });

    const t11Res = await fetch(`${BASE_API_URL}/availability/${availabilityId1}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t11Json = await t11Res.json();
    console.log('Status:', t11Res.status);
    console.log('Message:', t11Json.message);
    if (t11Res.status !== 409) {
      throw new Error('Test 11 Failed: Deleted slot despite active future booking');
    }
    console.log('✓ Test 11 Passed.');

    // Cancel appointment to free availability delete block
    await Appointment.update({ status: 'Cancelled' }, { where: { id: futureApp.id } });

    // ----------------------------------------------------
    // Test 10: Doctor deletes unused availability (Expect 200)
    // ----------------------------------------------------
    console.log('\n[TEST 10] Doctor deleting unused availability slot (Expect 200)...');
    const t10Res = await fetch(`${BASE_API_URL}/availability/${availabilityId1}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    console.log('Status:', t10Res.status);

    const dbRecordDel = await DoctorAvailability.findByPk(availabilityId1);
    console.log('DB slot exists:', !!dbRecordDel);

    if (t10Res.status !== 200 || dbRecordDel) {
      throw new Error('Test 10 Failed');
    }
    console.log('✓ Test 10 Passed.');

    // ----------------------------------------------------
    // Test 12: Unauthorized endpoint check (Expect 403)
    // ----------------------------------------------------
    console.log('\n[TEST 12] Patient attempting to create availability schedule (Expect 403)...');
    const t12Res = await fetch(`${BASE_API_URL}/availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patientAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dayOfWeek: 'Monday', startTime: '09:00', endTime: '12:00' })
    });
    console.log('Status:', t12Res.status);
    if (t12Res.status !== 403) {
      throw new Error('Test 12 Failed');
    }
    console.log('✓ Test 12 Passed.');

    // ----------------------------------------------------
    // Test 14: Activity Log validation
    // ----------------------------------------------------
    console.log('\n[TEST 14] Verifying created activity log actions...');
    const createdLogs = await ActivityLog.findAll({ where: { userId: doctorId, action: 'DOCTOR_AVAILABILITY_CREATED' } });
    const updatedLogs = await ActivityLog.findAll({ where: { userId: doctorId, action: 'DOCTOR_AVAILABILITY_UPDATED' } });
    const disabledLogs = await ActivityLog.findAll({ where: { userId: doctorId, action: 'DOCTOR_AVAILABILITY_DISABLED' } });
    const deletedLogs = await ActivityLog.findAll({ where: { userId: doctorId, action: 'DOCTOR_AVAILABILITY_DELETED' } });

    console.log('DOCTOR_AVAILABILITY_CREATED logs count:', createdLogs.length);
    console.log('DOCTOR_AVAILABILITY_UPDATED logs count:', updatedLogs.length);
    console.log('DOCTOR_AVAILABILITY_DISABLED logs count:', disabledLogs.length);
    console.log('DOCTOR_AVAILABILITY_DELETED logs count:', deletedLogs.length);

    if (createdLogs.length !== 1 || updatedLogs.length !== 1 || disabledLogs.length !== 1 || deletedLogs.length !== 1) {
      throw new Error('Test 14 Failed: Log count mismatch');
    }
    console.log('✓ Test 14 Passed.');

    // ----------------------------------------------------
    // Test 13: Rollback protection
    // ----------------------------------------------------
    console.log('\n[TEST 13] Verifying transaction rollback on database constraint failure...');
    await ActivityLog.destroy({ where: { entity: 'DoctorAvailability' } });

    let rollbackSuccess = false;
    try {
      // Bypasses validation to force database input index crash (invalid string dayOfWeek)
      await availabilityService.createAvailability(doctorId, {
        dayOfWeek: 'Monday',
        startTime: '10:00',
        endTime: 'invalid_time'
      });
    } catch (e) {
      rollbackSuccess = true;
      console.log('Service threw database error:', e.message);
    }

    const activityLogsAfter = await ActivityLog.findAll({ where: { entity: 'DoctorAvailability' } });
    console.log('Activity logs written for failed transaction:', activityLogsAfter.length);

    if (!rollbackSuccess || activityLogsAfter.length !== 0) {
      throw new Error('Test 13 Failed: Rollback not executed');
    }
    console.log('✓ Test 13 Passed.');

    console.log('\n=== ALL DOCTOR AVAILABILITY MODULE TESTS PASSED! ===');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    console.log('\nCleaning up database test records...');
    try {
      await Appointment.destroy({ where: { doctorId }, force: true });
      await DoctorAvailability.destroy({ where: { doctorId }, force: true });

      if (patientId) {
        await RefreshToken.destroy({ where: { userId: patientId } });
        await Patient.destroy({ where: { id: patientId }, force: true });
        await User.destroy({ where: { id: patientId }, force: true });
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
