const { User, RefreshToken, Doctor, Patient, ActivityLog, Appointment } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');
const patientService = require('../patient/services/patient.service');

delete process.env.PORT;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const port = process.env.PORT || 5000;
const BASE_API_URL = `http://localhost:${port}/api/v1`;
const BASE_AUTH_URL = `http://localhost:${port}/api/auth`;

async function runTests() {
  console.log('=== Starting Patient Profile Management Verification Tests ===');

  const timestamp = Date.now();
  const patientEmail = `patient_pp_${timestamp}@example.com`;
  const doctorEmail = `doctor_pp_${timestamp}@example.com`;
  const adminEmail = `admin_pp_${timestamp}@example.com`;
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
    const registerPatientRes = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: patientEmail,
        password,
        firstName: 'Test',
        lastName: 'Patient',
        gender: 'Male',
        dateOfBirth: '1990-01-01'
      })
    });
    const patientJson = await registerPatientRes.json();
    patientId = patientJson.data.id;

    // Login Patient
    const loginPatientRes = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmail, password })
    });
    const loginPatientJson = await loginPatientRes.json();
    patientAccessToken = loginPatientJson.data.accessToken;

    // Register Doctor (and set active & verified)
    const registerDoctorRes = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: doctorEmail,
        password,
        firstName: 'Test',
        lastName: 'Doctor',
        licenseNumber: `LIC_PP_${timestamp}`
      })
    });
    const doctorJson = await registerDoctorRes.json();
    doctorId = doctorJson.data.id;

    await User.update({ status: 'Active' }, { where: { id: doctorId } });
    await Doctor.update({ isVerified: true }, { where: { id: doctorId } });

    // Login Doctor
    const loginDoctorRes = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmail, password })
    });
    const loginDoctorJson = await loginDoctorRes.json();
    doctorAccessToken = loginDoctorJson.data.accessToken;

    // Create Admin directly in database
    const adminUser = await User.create({
      email: adminEmail,
      passwordHash: passHash,
      role: 'Admin',
      status: 'Active'
    });
    adminId = adminUser.id;

    // Login Admin
    const loginAdminRes = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password })
    });
    const loginAdminJson = await loginAdminRes.json();
    adminAccessToken = loginAdminJson.data.accessToken;

    console.log('✓ Setup complete.');

    // ----------------------------------------------------
    // Test 1: Patient retrieves own profile. Expect 200.
    // ----------------------------------------------------
    console.log('\n[TEST 1] Patient retrieving own profile (GET /patients/me)...');
    const t1Res = await fetch(`${BASE_API_URL}/patients/me`, {
      headers: { 'Authorization': `Bearer ${patientAccessToken}` }
    });
    const t1Json = await t1Res.json();
    console.log('Status:', t1Res.status);
    console.log('Keys in DTO:', Object.keys(t1Json.data));
    console.log('ProfileCompletionPercentage:', t1Json.data.profileCompletionPercentage);
    
    if (t1Res.status !== 200 || !t1Json.success) {
      throw new Error('Test 1 Failed: Request failed');
    }
    console.log('✓ Test 1 Passed.');

    // ----------------------------------------------------
    // Test 2: Patient updates profile. Verify DB and DTO.
    // ----------------------------------------------------
    console.log('\n[TEST 2] Patient updating health details (PUT /patients/me)...');
    const updatePayload = {
      bloodType: 'AB+',
      heightCm: 180.5,
      weightKg: 75.2,
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+1234567890',
      emergencyContactRelation: 'Spouse',
      allergies: 'Peanuts',
      medicalConditions: 'None',
      smokingStatus: 'Non-smoker',
      alcoholConsumption: 'Occasional',
      zipCode: '54321'
    };

    const t2Res = await fetch(`${BASE_API_URL}/patients/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${patientAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });
    const t2Json = await t2Res.json();
    console.log('Status:', t2Res.status);
    console.log('DTO Updated heightCm:', t2Json.data.heightCm);
    console.log('DTO Updated weightKg:', t2Json.data.weightKg);

    if (t2Res.status !== 200 || !t2Json.success) {
      throw new Error('Test 2 Failed');
    }

    // Verify DB
    const dbPatient = await Patient.findByPk(patientId);
    console.log('DB heightCm:', dbPatient.heightCm);
    console.log('DB weightKg:', dbPatient.weightKg);
    console.log('DB allergies:', dbPatient.allergies);

    if (parseFloat(dbPatient.weightKg) !== 75.2 || dbPatient.allergies !== 'Peanuts') {
      throw new Error('Test 2 Failed: DB not updated');
    }
    console.log('✓ Test 2 Passed.');

    // ----------------------------------------------------
    // Test 3: Profile completion recalculates correctly
    // ----------------------------------------------------
    console.log('\n[TEST 3] Verifying patient profile completion calculation...');
    // Evaluated Fields completed:
    // firstName, lastName, gender, dateOfBirth (set during register) => 4
    // bloodType, zipCode, emergencyContactName, emergencyContactPhone, emergencyContactRelation,
    // heightCm, weightKg, allergies, medicalConditions, smokingStatus, alcoholConsumption (set during update) => 11
    // Total completed = 15 out of 15 fields => 100%
    console.log('Returned completion %:', t2Json.data.profileCompletionPercentage);
    console.log('DB completion %:', dbPatient.profileCompletionPct);

    if (dbPatient.profileCompletionPct !== 100) {
      throw new Error(`Expected completion percentage to be 100, got ${dbPatient.profileCompletionPct}`);
    }
    console.log('✓ Test 3 Passed.');

    // ----------------------------------------------------
    // Test 4: Submitting identical data
    // ----------------------------------------------------
    console.log('\n[TEST 4] Submitting identical data to PUT /patients/me...');
    // Destroy previous logs to count only new ones
    await ActivityLog.destroy({ where: { userId: patientId } });

    const t4Res = await fetch(`${BASE_API_URL}/patients/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${patientAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });
    console.log('Status:', t4Res.status);
    
    const duplicateLogs = await ActivityLog.findAll({ where: { userId: patientId, action: 'PATIENT_PROFILE_UPDATED' } });
    console.log('Logs count written after identical update:', duplicateLogs.length);

    if (t4Res.status !== 200 || duplicateLogs.length !== 0) {
      throw new Error('Test 4 Failed: Submitting duplicate data should not execute updates or log activity');
    }
    console.log('✓ Test 4 Passed.');

    // ----------------------------------------------------
    // Test 5: Activity log exists only when changes occur
    // ----------------------------------------------------
    console.log('\n[TEST 5] Checking activity log exists for changes...');
    // We update one field (weightKg)
    const t5Res = await fetch(`${BASE_API_URL}/patients/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${patientAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ weightKg: 78.4 })
    });
    console.log('Status after weight change:', t5Res.status);

    const changeLogs = await ActivityLog.findAll({ where: { userId: patientId, action: 'PATIENT_PROFILE_UPDATED' } });
    console.log('Change logs count:', changeLogs.length);
    if (changeLogs.length !== 1) {
      throw new Error('Test 5 Failed: Activity log was not recorded on changes.');
    }
    console.log('✓ Test 5 Passed.');

    // ----------------------------------------------------
    // Test 6: Authorized doctor accesses related patient. Expect 200.
    // ----------------------------------------------------
    console.log('\n[TEST 6] Doctor retrieving related patient profile (GET /patients/doctor/:id)...');
    // Set doctor as the primary doctor for the patient in DB
    await Patient.update({ primaryDoctorId: doctorId }, { where: { id: patientId } });

    const t6Res = await fetch(`${BASE_API_URL}/patients/doctor/${patientId}`, {
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t6Json = await t6Res.json();
    console.log('Status:', t6Res.status);
    console.log('Doctor Patient DTO keys:', Object.keys(t6Json.data));
    console.log('Doctor Patient age:', t6Json.data.age);

    const leakedKeys = ['email', 'phone', 'isVerified', 'status'];
    for (const key of leakedKeys) {
      if (t6Json.data[key] !== undefined) {
        throw new Error(`Security Leak: Doctor DTO exposed sensitive key ${key}`);
      }
    }
    if (t6Res.status !== 200 || typeof t6Json.data.age !== 'number') {
      throw new Error('Test 6 Failed: Relationship validation failed or age calculation not returned');
    }
    console.log('✓ Test 6 Passed.');

    // ----------------------------------------------------
    // Test 7: Unrelated doctor accesses patient. Expect 404.
    // ----------------------------------------------------
    console.log('\n[TEST 7] Unrelated doctor accessing patient profile...');
    // Unlink the primary doctor connection
    await Patient.update({ primaryDoctorId: null }, { where: { id: patientId } });

    const t7Res = await fetch(`${BASE_API_URL}/patients/doctor/${patientId}`, {
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t7Json = await t7Res.json();
    console.log('Status:', t7Res.status);
    console.log('Message:', t7Json.message);

    if (t7Res.status !== 404 || t7Json.message !== 'Patient profile not found.') {
      throw new Error('Test 7 Failed: Expected 404 Not Found to protect patient privacy');
    }
    console.log('✓ Test 7 Passed.');

    // ----------------------------------------------------
    // Test 8: Admin retrieves patient. Expect 200.
    // ----------------------------------------------------
    console.log('\n[TEST 8] Admin retrieving complete patient profile (GET /patients/admin/:id)...');
    const t8Res = await fetch(`${BASE_API_URL}/patients/admin/${patientId}`, {
      headers: { 'Authorization': `Bearer ${adminAccessToken}` }
    });
    const t8Json = await t8Res.json();
    console.log('Status:', t8Res.status);
    console.log('Admin Patient DTO contains email:', t8Json.data.email);

    if (t8Res.status !== 200 || t8Json.data.email !== patientEmail) {
      throw new Error('Test 8 Failed: Admin retrieve failed');
    }
    console.log('✓ Test 8 Passed.');

    // ----------------------------------------------------
    // Test 9: Validation failures. Expect 400.
    // ----------------------------------------------------
    console.log('\n[TEST 9] Testing input validation constraints...');
    
    // a. Invalid bloodType
    const failResA = await fetch(`${BASE_API_URL}/patients/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${patientAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ bloodType: 'X-' })
    });
    console.log('Invalid bloodType status:', failResA.status);

    // b. height < 20
    const failResB = await fetch(`${BASE_API_URL}/patients/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${patientAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ heightCm: 15 })
    });
    console.log('Negative/low height status:', failResB.status);

    // c. weight < 1
    const failResC = await fetch(`${BASE_API_URL}/patients/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${patientAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ weightKg: 0.5 })
    });
    console.log('Negative/low weight status:', failResC.status);

    // d. invalid smokingStatus enum
    const failResD = await fetch(`${BASE_API_URL}/patients/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${patientAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ smokingStatus: 'Heavy smoker' })
    });
    console.log('Invalid smoking enum status:', failResD.status);

    if (failResA.status !== 400 || failResB.status !== 400 || failResC.status !== 400 || failResD.status !== 400) {
      throw new Error('Test 9 Failed: Validation parameters not protected');
    }
    console.log('✓ Test 9 Passed.');

    // ----------------------------------------------------
    // Test 10: Force transaction failure
    // ----------------------------------------------------
    console.log('\n[TEST 10] Testing transaction rollback by calling service directly with database ENUM violation...');
    // Empty logs to count only new ones
    await ActivityLog.destroy({ where: { userId: patientId } });

    // Directly trigger patientService.updateMyProfile with an invalid gender string to bypass express-validator
    // and hit the database ENUM constraint.
    let didThrow = false;
    try {
      await patientService.updateMyProfile(patientId, {
        firstName: 'ROLLBACK_PATIENT_NAME',
        gender: 'InvalidGenderValueBypassingValidator'
      });
    } catch (e) {
      didThrow = true;
      console.log('Service threw expected database error:', e.message);
    }

    // Verify database remains unchanged (rollback)
    const dbPatientAfterFail = await Patient.findByPk(patientId);
    console.log('DB firstName after failure:', dbPatientAfterFail.firstName);
    
    // Verify no activity log was written
    const failLogs = await ActivityLog.findAll({ where: { userId: patientId, action: 'PATIENT_PROFILE_UPDATED' } });
    console.log('Logs after failure:', failLogs.length);

    if (!didThrow) {
      throw new Error('Test 10 Failed: Service did not throw on invalid gender ENUM value');
    }
    if (dbPatientAfterFail.firstName === 'ROLLBACK_PATIENT_NAME') {
      throw new Error('Test 10 Failed: Database updated, transaction rollback failed!');
    }
    if (failLogs.length !== 0) {
      throw new Error('Test 10 Failed: Activity log written for failed transaction');
    }
    console.log('✓ Test 10 Passed.');

    // ----------------------------------------------------
    // Test 11: Submit empty update {}
    // ----------------------------------------------------
    console.log('\n[TEST 11] Performing empty update (PUT /patients/me with {})...');
    await ActivityLog.destroy({ where: { userId: patientId } });

    const emptyRes = await fetch(`${BASE_API_URL}/patients/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${patientAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    console.log('Empty update status:', emptyRes.status);

    const emptyLogs = await ActivityLog.findAll({ where: { userId: patientId, action: 'PATIENT_PROFILE_UPDATED' } });
    console.log('Logs written after empty update:', emptyLogs.length);

    if (emptyRes.status !== 200 || emptyLogs.length !== 0) {
      throw new Error('Test 11 Failed: Empty update should return success but log no activity events');
    }
    console.log('✓ Test 11 Passed.');

    console.log('\n=== ALL PATIENT PROFILE MODULE TESTS PASSED! ===');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    console.log('\nCleaning up database test records...');
    try {
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
