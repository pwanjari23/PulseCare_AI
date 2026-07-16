const { User, RefreshToken, Doctor, Patient, ActivityLog } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');

const BASE_API_URL = 'http://localhost:5000/api/v1';
const BASE_AUTH_URL = 'http://localhost:5000/api/auth';

async function runTests() {
  console.log('=== Starting Doctor Profile Management Verification Tests ===');

  const timestamp = Date.now();
  const patientEmail = `patient_dp_${timestamp}@example.com`;
  const doctorEmail = `doctor_dp_${timestamp}@example.com`;
  const adminEmail = `admin_dp_${timestamp}@example.com`;
  const password = 'Password123!';

  let patientId, doctorId, adminId;
  let patientAccessToken, doctorAccessToken, adminAccessToken;
  let patientRefreshToken, doctorRefreshToken;

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

    // Register Doctor (starts with status = Inactive, isVerified = false)
    const registerDoctorRes = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: doctorEmail,
        password,
        firstName: 'Test',
        lastName: 'Doctor',
        licenseNumber: `LIC_DP_${timestamp}`
      })
    });
    const doctorJson = await registerDoctorRes.json();
    doctorId = doctorJson.data.id;

    // Activate Doctor User so they can login, but leave doctor.isVerified = false for Test 7
    await User.update({ status: 'Active' }, { where: { id: doctorId } });

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
    // Test 1: Doctor retrieves own profile. Expect 200.
    // ----------------------------------------------------
    console.log('\n[TEST 1] Doctor retrieving own profile (GET /doctors/me)...');
    const t1Res = await fetch(`${BASE_API_URL}/doctors/me`, {
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t1Json = await t1Res.json();
    console.log('Status:', t1Res.status);
    console.log('Keys in DTO:', Object.keys(t1Json.data));
    console.log('Languages in DTO:', t1Json.data.languages);
    
    if (t1Res.status !== 200 || !t1Json.success) {
      throw new Error('Test 1 Failed: Request failed');
    }
    if (!Array.isArray(t1Json.data.languages)) {
      throw new Error('Test 1 Failed: languages should be an array DTO');
    }
    console.log('✓ Test 1 Passed.');

    // ----------------------------------------------------
    // Test 2: Patient requests /doctors/me. Expect 403.
    // ----------------------------------------------------
    console.log('\n[TEST 2] Patient requesting own profile under doctor namespace...');
    const t2Res = await fetch(`${BASE_API_URL}/doctors/me`, {
      headers: { 'Authorization': `Bearer ${patientAccessToken}` }
    });
    const t2Json = await t2Res.json();
    console.log('Status:', t2Res.status);
    console.log('Message:', t2Json.message);
    if (t2Res.status !== 403 || t2Json.message !== 'You are not authorized to access this resource.') {
      throw new Error('Test 2 Failed');
    }
    console.log('✓ Test 2 Passed.');

    // ----------------------------------------------------
    // Test 3: Doctor updates profile successfully.
    // ----------------------------------------------------
    console.log('\n[TEST 3] Doctor updating clinic and bio...');
    const updatePayload = {
      clinicName: 'Alpha Medical Center',
      clinicAddress: '123 Main St, Springfield',
      clinicZip: '12345',
      experienceYears: 10,
      consultationFee: 200,
      languages: ['English', 'Spanish'],
      bio: 'Board-certified primary care physician.',
      profileImage: 'https://images.unsplash.com/photo-1559839734?w=300'
    };

    const t3Res = await fetch(`${BASE_API_URL}/doctors/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });
    const t3Json = await t3Res.json();
    console.log('Status:', t3Res.status);
    console.log('Updated ProfileCompletionPercentage:', t3Json.data.profileCompletionPercentage);

    if (t3Res.status !== 200 || !t3Json.success) {
      throw new Error('Test 3 Failed: Request failed');
    }
    
    // Verify database record directly
    const dbDoctor = await Doctor.findByPk(doctorId);
    console.log('Database clinicName:', dbDoctor.clinicName);
    console.log('Database bio:', dbDoctor.bio);
    console.log('Database languages type:', typeof dbDoctor.languages, dbDoctor.languages);

    if (dbDoctor.clinicName !== 'Alpha Medical Center' || dbDoctor.bio !== 'Board-certified primary care physician.') {
      throw new Error('Test 3 Failed: DB not updated properly');
    }
    if (!Array.isArray(dbDoctor.languages)) {
      throw new Error('Test 3 Failed: DB column languages should be stored as JSON array');
    }
    console.log('✓ Test 3 Passed.');

    // ----------------------------------------------------
    // Test 4: Profile completion recalculates correctly
    // ----------------------------------------------------
    console.log('\n[TEST 4] Verifying profile completion calculations...');
    // We updated clinicName, clinicAddress, clinicZip, experienceYears, consultationFee, languages, bio, profileImage.
    // We left specializationId empty.
    // So 8 out of 9 fields are complete.
    // (8/9) * 100 = 89%
    console.log('Returned completion %:', t3Json.data.profileCompletionPercentage);
    console.log('DB completion %:', dbDoctor.profileCompletionPct);
    
    if (dbDoctor.profileCompletionPct !== 89) {
      throw new Error(`Expected completion percentage to be 89, got ${dbDoctor.profileCompletionPct}`);
    }
    console.log('✓ Test 4 Passed.');

    // ----------------------------------------------------
    // Test 5: DOCTOR_PROFILE_UPDATED activity log exists
    // ----------------------------------------------------
    console.log('\n[TEST 5] Checking activity logs for update event...');
    const logs = await ActivityLog.findAll({ where: { userId: doctorId, action: 'DOCTOR_PROFILE_UPDATED' } });
    console.log('Found DOCTOR_PROFILE_UPDATED logs count:', logs.length);
    if (logs.length !== 1) {
      throw new Error('Test 5 Failed: Activity log was not created or created multiple times.');
    }
    console.log('✓ Test 5 Passed.');

    // ----------------------------------------------------
    // Test 6: Public endpoint returns only safe fields
    // ----------------------------------------------------
    console.log('\n[TEST 6] Accessing public endpoint with verified check (Setting isVerified = true first)...');
    // Set verified to true so the endpoint allows access
    await Doctor.update({ isVerified: true }, { where: { id: doctorId } });

    const t6Res = await fetch(`${BASE_API_URL}/doctors/${doctorId}`);
    const t6Json = await t6Res.json();
    console.log('Status:', t6Res.status);
    console.log('Public DTO Keys:', Object.keys(t6Json.data));

    const exposedUnsafeKeys = ['licenseNumber', 'email', 'phone', 'isVerified', 'status'];
    for (const key of exposedUnsafeKeys) {
      if (t6Json.data[key] !== undefined) {
        throw new Error(`Security Leak: public DTO exposed ${key}!`);
      }
    }
    console.log('✓ Test 6 Passed.');

    // ----------------------------------------------------
    // Test 7: Public endpoint never exposes unverified doctors
    // ----------------------------------------------------
    console.log('\n[TEST 7] Accessing public endpoint for unverified doctor...');
    // Set verified to false
    await Doctor.update({ isVerified: false }, { where: { id: doctorId } });

    const t7Res = await fetch(`${BASE_API_URL}/doctors/${doctorId}`);
    const t7Json = await t7Res.json();
    console.log('Status:', t7Res.status);
    console.log('Message:', t7Json.message);
    if (t7Res.status !== 404 || t7Json.message !== 'Doctor profile not found.') {
      throw new Error('Test 7 Failed: Expected 404 Not Found for unverified doctor');
    }
    console.log('✓ Test 7 Passed.');

    // ----------------------------------------------------
    // Test 8: Admin retrieves doctor profile. Expect full private DTO.
    // ----------------------------------------------------
    console.log('\n[TEST 8] Admin retrieving complete doctor profile...');
    const t8Res = await fetch(`${BASE_API_URL}/admin/doctors/${doctorId}`, {
      headers: { 'Authorization': `Bearer ${adminAccessToken}` }
    });
    const t8Json = await t8Res.json();
    console.log('Status:', t8Res.status);
    console.log('Admin DTO Keys contains email/status:', t8Json.data.email, t8Json.data.status);
    if (t8Res.status !== 200 || !t8Json.data.email) {
      throw new Error('Test 8 Failed');
    }
    console.log('✓ Test 8 Passed.');

    // ----------------------------------------------------
    // Test 9: Input Validation Constraints
    // ----------------------------------------------------
    console.log('\n[TEST 9] Testing input validation constraints...');
    
    // a. experience > 60
    const failResA = await fetch(`${BASE_API_URL}/doctors/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${doctorAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ experienceYears: 65 })
    });
    console.log('Exp > 60 status:', failResA.status);

    // b. fee < 0
    const failResB = await fetch(`${BASE_API_URL}/doctors/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${doctorAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ consultationFee: -10 })
    });
    console.log('Fee < 0 status:', failResB.status);

    // c. fee > 50000
    const failResC = await fetch(`${BASE_API_URL}/doctors/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${doctorAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ consultationFee: 55000 })
    });
    console.log('Fee > 50000 status:', failResC.status);

    // d. duplicate languages
    const failResD = await fetch(`${BASE_API_URL}/doctors/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${doctorAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ languages: ['English', 'english'] })
    });
    console.log('Duplicate languages status:', failResD.status);

    // e. invalid profile URL
    const failResE = await fetch(`${BASE_API_URL}/doctors/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${doctorAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileImage: 'invalid-url' })
    });
    console.log('Invalid URL status:', failResE.status);

    if (failResA.status !== 400 || failResB.status !== 400 || failResC.status !== 400 || failResD.status !== 400 || failResE.status !== 400) {
      throw new Error('Test 9 Failed: Validation rules not enforced');
    }
    console.log('✓ Test 9 Passed.');

    // ----------------------------------------------------
    // Test 10: Rollback verification
    // ----------------------------------------------------
    console.log('\n[TEST 10] Testing transaction rollback on DB failure (invalid specializationId)...');
    
    // Clear logs first to isolate this check
    await ActivityLog.destroy({ where: { userId: doctorId } });

    // Request PUT /me with a non-existent specializationId (99999) which violates foreign key constraints
    const rollbackRes = await fetch(`${BASE_API_URL}/doctors/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clinicName: 'SHOULD_ROLLBACK_CLINIC',
        specializationId: 99999
      })
    });
    const rollbackJson = await rollbackRes.json();
    console.log('Rollback response status:', rollbackRes.status);
    console.log('Rollback response body message:', rollbackJson.message);

    // Verify database remains unchanged
    const dbDoctorAfterFail = await Doctor.findByPk(doctorId);
    console.log('DB clinicName after failure:', dbDoctorAfterFail.clinicName);
    
    // Verify no activity log was written
    const failLogs = await ActivityLog.findAll({ where: { userId: doctorId, action: 'DOCTOR_PROFILE_UPDATED' } });
    console.log('Logs after failure:', failLogs.length);

    if (dbDoctorAfterFail.clinicName === 'SHOULD_ROLLBACK_CLINIC') {
      throw new Error('Test 10 Failed: database was updated, rollback failed!');
    }
    if (failLogs.length !== 0) {
      throw new Error('Test 10 Failed: activity log was written for failed transaction');
    }
    console.log('✓ Test 10 Passed.');

    // ----------------------------------------------------
    // Test 11: Empty update. Expect 200, no db write, no activity log.
    // ----------------------------------------------------
    console.log('\n[TEST 11] Performing empty update (PUT /doctors/me with {})...');
    // Clear activity logs for clean count
    await ActivityLog.destroy({ where: { userId: doctorId } });

    const emptyRes = await fetch(`${BASE_API_URL}/doctors/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${doctorAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const emptyJson = await emptyRes.json();
    console.log('Empty update status:', emptyRes.status);
    console.log('Empty update data keys:', Object.keys(emptyJson.data));

    const dbLogsAfterEmpty = await ActivityLog.findAll({ where: { userId: doctorId, action: 'DOCTOR_PROFILE_UPDATED' } });
    console.log('Logs written after empty update:', dbLogsAfterEmpty.length);

    if (emptyRes.status !== 200 || dbLogsAfterEmpty.length !== 0) {
      throw new Error('Test 11 Failed: Empty update should succeed but log no activity events');
    }
    console.log('✓ Test 11 Passed.');

    console.log('\n=== ALL DOCTOR PROFILE MODULE TESTS PASSED! ===');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    console.log('\nCleaning up database test records...');
    try {
      if (doctorId) {
        await RefreshToken.destroy({ where: { userId: doctorId } });
        await Doctor.destroy({ where: { id: doctorId }, force: true });
        await User.destroy({ where: { id: doctorId }, force: true });
      }
      if (patientId) {
        await Patient.destroy({ where: { id: patientId }, force: true });
        await User.destroy({ where: { id: patientId }, force: true });
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
