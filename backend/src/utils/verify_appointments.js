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
  console.log('=== Starting Phase 5.4 Appointment Booking & Management Verification Tests ===');

  const timestamp = Date.now();
  const patientEmailA = `pat_a_v54_${timestamp}@example.com`;
  const patientEmailB = `pat_b_v54_${timestamp}@example.com`;
  const doctorEmail = `doc_v54_${timestamp}@example.com`;
  const adminEmail = `admin_v54_${timestamp}@example.com`;
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

    // Register Doctor (Starts unverified and inactive)
    const regDoc = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: doctorEmail, password, firstName: 'Sarah', lastName: 'Conner', licenseNumber: `LIC_V54_${timestamp}`
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

    // Time definitions
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2); // 2 days in the future
    futureDate.setHours(10, 0, 0, 0); // 10:00 AM
    const scheduledStr = futureDate.toISOString();

    // ----------------------------------------------------
    // Test 1: Inactive doctor booking check (Expect 403)
    // ----------------------------------------------------
    console.log('\n[TEST 1] Booking with inactive/unverified doctor...');
    const t1Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, scheduledAt: scheduledStr })
    });
    const t1Json = await t1Res.json();
    console.log('Inactive doctor status:', t1Res.status);
    console.log('Inactive doctor message:', t1Json.message);
    if (t1Res.status !== 403) {
      throw new Error('Test 1 Failed: Expected 403 Forbidden for inactive doctor');
    }
    console.log('✓ Test 1 Passed.');

    // Activate doctor, but keep unverified
    await User.update({ status: 'Active' }, { where: { id: doctorId } });

    // ----------------------------------------------------
    // Test 2: Unverified doctor booking check (Expect 400)
    // ----------------------------------------------------
    console.log('\n[TEST 2] Booking with unverified active doctor...');
    const t2Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, scheduledAt: scheduledStr })
    });
    const t2Json = await t2Res.json();
    console.log('Unverified doctor status:', t2Res.status);
    console.log('Unverified doctor message:', t2Json.message);
    if (t2Res.status !== 400) {
      throw new Error('Test 2 Failed: Expected 400 Bad Request for unverified doctor');
    }
    console.log('✓ Test 2 Passed.');

    // Verify doctor
    await Doctor.update({ isVerified: true }, { where: { id: doctorId } });

    // Login doctor to get access token
    const loginDoc = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmail, password })
    });
    doctorAccessToken = (await loginDoc.json()).data.accessToken;

    // ----------------------------------------------------
    // Test 3: Patient books appointment (Default duration 30, status Scheduled)
    // ----------------------------------------------------
    console.log('\n[TEST 3] Patient A booking appointment (GET /appointments)...');
    const t3Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, scheduledAt: scheduledStr, reason: 'Regular Checkup' })
    });
    const t3Json = await t3Res.json();
    console.log('Status:', t3Res.status);
    console.log('Default durationMinutes:', t3Json.data.durationMinutes);
    console.log('Default status:', t3Json.data.status);

    if (t3Res.status !== 201 || t3Json.data.status !== 'Scheduled' || t3Json.data.durationMinutes !== 30) {
      throw new Error('Test 3 Failed: Default values or response code mismatch');
    }
    const appointmentId1 = t3Json.data.id;
    console.log('✓ Test 3 Passed.');

    // ----------------------------------------------------
    // Test 4: Book overlapping appointment (Expect 400)
    // ----------------------------------------------------
    console.log('\n[TEST 4] Booking overlap slot with doctor (Expect 400)...');
    const t4Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${patientAccessTokenB}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, scheduledAt: scheduledStr, reason: 'Overlapping consultation' })
    });
    const t4Json = await t4Res.json();
    console.log('Status:', t4Res.status);
    console.log('Message:', t4Json.message);

    if (t4Res.status !== 400 || t4Json.message !== 'Doctor is unavailable for the selected time slot.') {
      throw new Error('Test 4 Failed: Double booking was not prevented');
    }
    console.log('✓ Test 4 Passed.');

    // ----------------------------------------------------
    // Test 5: Booking in the past (Expect 400)
    // ----------------------------------------------------
    console.log('\n[TEST 5] Booking appointment in the past (Expect 400)...');
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);

    const t5Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, scheduledAt: pastDate.toISOString() })
    });
    console.log('Status:', t5Res.status);
    if (t5Res.status !== 400) {
      throw new Error('Test 5 Failed: Past booking allowed');
    }
    console.log('✓ Test 5 Passed.');

    // ----------------------------------------------------
    // Test 6: Patient views own appointments list
    // ----------------------------------------------------
    console.log('\n[TEST 6] Patient A viewing own bookings list (GET /appointments/me)...');
    const t6Res = await fetch(`${BASE_API_URL}/appointments/me`, {
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}` }
    });
    const t6Json = await t6Res.json();
    console.log('Status:', t6Res.status);
    console.log('Bookings list count:', t6Json.data.length);
    if (t6Res.status !== 200 || t6Json.data.length !== 1) {
      throw new Error('Test 6 Failed');
    }
    console.log('✓ Test 6 Passed.');

    // ----------------------------------------------------
    // Test 7: Doctor views own appointments list
    // ----------------------------------------------------
    console.log('\n[TEST 7] Doctor Sarah viewing schedule list (GET /appointments/doctor)...');
    const t7Res = await fetch(`${BASE_API_URL}/appointments/doctor`, {
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t7Json = await t7Res.json();
    console.log('Status:', t7Res.status);
    console.log('Doctor list count:', t7Json.data.length);
    if (t7Res.status !== 200 || t7Json.data.length !== 1) {
      throw new Error('Test 7 Failed');
    }
    console.log('✓ Test 7 Passed.');

    // ----------------------------------------------------
    // Test 8: Unauthorized lookup check (Expect 403)
    // ----------------------------------------------------
    console.log('\n[TEST 8] Patient B querying Patient A\'s appointment (Expect 403)...');
    const t8Res = await fetch(`${BASE_API_URL}/appointments/${appointmentId1}`, {
      headers: { 'Authorization': `Bearer ${patientAccessTokenB}` }
    });
    const t8Json = await t8Res.json();
    console.log('Status:', t8Res.status);
    console.log('Message:', t8Json.message);
    if (t8Res.status !== 403 || t8Json.message !== 'You are not authorized to view this appointment.') {
      throw new Error('Test 8 Failed: Privacy check bypassed');
    }
    console.log('✓ Test 8 Passed.');

    // ----------------------------------------------------
    // Test 9: Admin can view any appointment (Expect 200)
    // ----------------------------------------------------
    console.log('\n[TEST 9] Admin retrieving Patient A\'s appointment (Expect 200)...');
    const t9Res = await fetch(`${BASE_API_URL}/appointments/${appointmentId1}`, {
      headers: { 'Authorization': `Bearer ${adminAccessToken}` }
    });
    const t9Json = await t9Res.json();
    console.log('Status:', t9Res.status);
    console.log('Returned DTO Patient ID:', t9Json.data.patient.id);
    if (t9Res.status !== 200 || t9Json.data.patient.id !== patientIdA) {
      throw new Error('Test 9 Failed: Admin lookup rejected');
    }
    console.log('✓ Test 9 Passed.');

    // ----------------------------------------------------
    // Test 10: Doctor completes appointment and persists notes
    // ----------------------------------------------------
    console.log('\n[TEST 10] Doctor completing Scheduled appointment with notes...');
    const notesStr = 'Patient displays normal clinical vitals. Suggest routine followup.';
    const t10Res = await fetch(`${BASE_API_URL}/appointments/${appointmentId1}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes: notesStr })
    });
    const t10Json = await t10Res.json();
    console.log('Status:', t10Res.status);
    console.log('DTO notes:', t10Json.data.notes);
    console.log('DTO status:', t10Json.data.status);

    const dbAppComp = await Appointment.findByPk(appointmentId1);
    console.log('DB notes:', dbAppComp.notes);
    console.log('DB status:', dbAppComp.status);

    if (t10Res.status !== 200 || dbAppComp.status !== 'Completed' || dbAppComp.notes !== notesStr) {
      throw new Error('Test 10 Failed: Complete status or notes update failed');
    }
    console.log('✓ Test 10 Passed.');

    // ----------------------------------------------------
    // Test 11: Cancel completed appointment (Expect 400)
    // ----------------------------------------------------
    console.log('\n[TEST 11] Patient attempting to cancel Completed appointment (Expect 400)...');
    const t11Res = await fetch(`${BASE_API_URL}/appointments/${appointmentId1}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}` }
    });
    const t11Json = await t11Res.json();
    console.log('Status:', t11Res.status);
    console.log('Message:', t11Json.message);
    if (t11Res.status !== 400 || t11Json.message !== 'Completed appointments cannot be cancelled.') {
      throw new Error('Test 11 Failed: Cancel Completed booking allowed');
    }
    console.log('✓ Test 11 Passed.');

    // ----------------------------------------------------
    // Test 12: Cancel future appointment
    // ----------------------------------------------------
    console.log('\n[TEST 12] Booking and cancelling a new appointment...');
    const booking2Str = new Date(futureDate.getTime() + 60 * 60 * 1000).toISOString(); // 1 hour later
    
    // Book Second appointment
    const book2Res = await fetch(`${BASE_API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, scheduledAt: booking2Str, durationMinutes: 45 })
    });
    const app2Id = (await book2Res.json()).data.id;

    // Cancel Second appointment
    const cancelRes = await fetch(`${BASE_API_URL}/appointments/${app2Id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}` }
    });
    const cancelJson = await cancelRes.json();
    console.log('Cancel Status:', cancelRes.status);
    console.log('Cancelled DTO status:', cancelJson.data.status);

    const dbAppCanc = await Appointment.findByPk(app2Id);
    if (cancelRes.status !== 200 || dbAppCanc.status !== 'Cancelled') {
      throw new Error('Test 12 Failed: Cancellation failed');
    }

    // ----------------------------------------------------
    // Test 13: Cannot cancel twice (Expect 400)
    // ----------------------------------------------------
    console.log('\n[TEST 13] Patient attempting to cancel already Cancelled appointment (Expect 400)...');
    const cancelTwiceRes = await fetch(`${BASE_API_URL}/appointments/${app2Id}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}` }
    });
    const cancelTwiceJson = await cancelTwiceRes.json();
    console.log('Status:', cancelTwiceRes.status);
    console.log('Message:', cancelTwiceJson.message);
    if (cancelTwiceRes.status !== 400 || cancelTwiceJson.message !== 'Appointment is already cancelled.') {
      throw new Error('Test 13 Failed: Double cancel not blocked');
    }
    console.log('✓ Test 13 Passed.');

    // ----------------------------------------------------
    // Test 14: Verify Activity Logs (APPOINTMENT_BOOKED & APPOINTMENT_COMPLETED)
    // ----------------------------------------------------
    console.log('\n[TEST 14] Verifying created activity logs...');
    const bookedLogs = await ActivityLog.findAll({ where: { userId: patientIdA, action: 'APPOINTMENT_BOOKED' } });
    const completedLogs = await ActivityLog.findAll({ where: { userId: doctorId, action: 'APPOINTMENT_COMPLETED' } });
    const cancelledLogs = await ActivityLog.findAll({ where: { userId: patientIdA, action: 'APPOINTMENT_CANCELLED' } });

    console.log('APPOINTMENT_BOOKED logs count:', bookedLogs.length);
    console.log('APPOINTMENT_COMPLETED logs count:', completedLogs.length);
    console.log('APPOINTMENT_CANCELLED logs count:', cancelledLogs.length);

    if (bookedLogs.length !== 2 || completedLogs.length !== 1 || cancelledLogs.length !== 1) {
      throw new Error('Test 14 Failed: Activity log counts mismatch');
    }
    console.log('✓ Test 14 Passed.');

    // ----------------------------------------------------
    // Test 15: DTO Sanitization check
    // ----------------------------------------------------
    console.log('\n[TEST 15] Verifying DTO sanitization (no user keys leak)...');
    const sensitiveKeys = ['passwordHash', 'refreshTokens', 'deletedAt'];
    for (const key of sensitiveKeys) {
      if (t3Json.data[key] !== undefined || t10Json.data[key] !== undefined) {
        throw new Error(`Security Leak: Sanitized DTO exposed sensitive key ${key}`);
      }
    }
    console.log('✓ Test 15 Passed.');

    // ----------------------------------------------------
    // Test 16: Transaction rollback on DB failure
    // ----------------------------------------------------
    console.log('\n[TEST 16] Testing transaction rollback by bypass-calling service with database constraint violation...');
    await ActivityLog.destroy({ where: { entity: 'Appointment' } });

    let throwSuccess = false;
    try {
      // Force database ENUM error on completeAppointment directly bypassing Express validators
      await appointmentService.completeAppointment(doctorId, appointmentId1, 'Notes', 'InvalidStatusBypassingValidation');
    } catch (e) {
      throwSuccess = true;
      console.log('Service threw database error:', e.message);
    }

    const appAfterFail = await Appointment.findByPk(appointmentId1);
    const logsAfterFail = await ActivityLog.findAll({ where: { entityId: appointmentId1 } });
    console.log('Appointment status after failure (expected Completed):', appAfterFail.status);
    console.log('Activity logs count after failure (expected 0):', logsAfterFail.length);

    if (!throwSuccess || appAfterFail.status !== 'Completed' || logsAfterFail.length !== 0) {
      throw new Error('Test 16 Failed: Transaction rollback was not executed cleanly');
    }
    console.log('✓ Test 16 Passed.');

    console.log('\n=== ALL PHASE 5.4 APPOINTMENT MODULE TESTS PASSED! ===');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    console.log('\nCleaning up database test records...');
    try {
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
