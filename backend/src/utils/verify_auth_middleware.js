const { User, RefreshToken, Doctor, Patient } = require('../models');
const { sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const { hashPassword } = require('../auth/utils/password');

delete process.env.PORT;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const port = process.env.PORT || 5000;
const BASE_API_URL = `http://localhost:${port}/api/v1`;
const BASE_AUTH_URL = `http://localhost:${port}/api/auth`;

async function runTests() {
  console.log('=== Starting JWT Auth & Role-Based Authorization Middleware Tests ===');

  const timestamp = Date.now();
  const patientEmail = `patient_${timestamp}@example.com`;
  const doctorEmail = `doctor_${timestamp}@example.com`;
  const adminEmail = `admin_${timestamp}@example.com`;
  const password = 'Password123!';

  let patientId, doctorId, adminId;
  let patientAccessToken, doctorAccessToken, adminAccessToken;
  let patientRefreshToken, doctorRefreshToken;

  try {
    // Setup Admin, Patient, Doctor users in database
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
    patientRefreshToken = loginPatientJson.data.refreshToken;

    // Register Doctor
    const registerDoctorRes = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: doctorEmail,
        password,
        firstName: 'Test',
        lastName: 'Doctor',
        licenseNumber: `LIC_${timestamp}`
      })
    });
    const doctorJson = await registerDoctorRes.json();
    doctorId = doctorJson.data.id;

    // Set Doctor to Active and Verified in database to allow login
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
    doctorRefreshToken = loginDoctorJson.data.refreshToken;

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
    // Test 1: Access protected route WITHOUT token
    // ----------------------------------------------------
    console.log('\n[TEST 1] Accessing profile WITHOUT token...');
    const t1Res = await fetch(`${BASE_API_URL}/profile`);
    const t1Json = await t1Res.json();
    console.log('Status:', t1Res.status);
    console.log('Message:', t1Json.message);
    if (t1Res.status !== 401 || t1Json.message !== 'Access token is required.') {
      throw new Error('Test 1 Failed');
    }
    console.log('✓ Test 1 Passed.');

    // ----------------------------------------------------
    // Test 2: Malformed Authorization header
    // ----------------------------------------------------
    console.log('\n[TEST 2] Accessing profile with malformed header...');
    const t2Res = await fetch(`${BASE_API_URL}/profile`, {
      headers: { 'Authorization': 'abcdef' }
    });
    const t2Json = await t2Res.json();
    console.log('Status:', t2Res.status);
    console.log('Message:', t2Json.message);
    if (t2Res.status !== 401 || t2Json.message !== 'Invalid authorization header.') {
      throw new Error('Test 2 Failed');
    }
    console.log('✓ Test 2 Passed.');

    // ----------------------------------------------------
    // Test 3: Invalid JWT
    // ----------------------------------------------------
    console.log('\n[TEST 3] Accessing profile with invalid JWT...');
    const t3Res = await fetch(`${BASE_API_URL}/profile`, {
      headers: { 'Authorization': 'Bearer invalidtoken123' }
    });
    const t3Json = await t3Res.json();
    console.log('Status:', t3Res.status);
    console.log('Message:', t3Json.message);
    if (t3Res.status !== 401 || t3Json.message !== 'Invalid or expired access token.') {
      throw new Error('Test 3 Failed');
    }
    console.log('✓ Test 3 Passed.');

    // ----------------------------------------------------
    // Test 4: Expired JWT
    // ----------------------------------------------------
    console.log('\n[TEST 4] Accessing profile with expired JWT...');
    // Create an expired access token manually
    const expiredToken = jwt.sign(
      { id: patientId, email: patientEmail, role: 'Patient' },
      config.accessSecret,
      { expiresIn: '-10s' }
    );
    const t4Res = await fetch(`${BASE_API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${expiredToken}` }
    });
    const t4Json = await t4Res.json();
    console.log('Status:', t4Res.status);
    console.log('Message:', t4Json.message);
    if (t4Res.status !== 401 || t4Json.message !== 'Invalid or expired access token.') {
      throw new Error('Test 4 Failed');
    }
    console.log('✓ Test 4 Passed.');

    // ----------------------------------------------------
    // Test 5: Deleted user
    // ----------------------------------------------------
    console.log('\n[TEST 5] Accessing profile with deleted user...');
    // Create a temporary user to delete
    const delEmail = `del_${timestamp}@example.com`;
    await User.create({ email: delEmail, passwordHash: passHash, role: 'Patient', status: 'Active' });
    const loginDelRes = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: delEmail, password })
    });
    const loginDelJson = await loginDelRes.json();
    const delAccessToken = loginDelJson.data.accessToken;
    const delUserId = loginDelJson.data.user.id;

    // Hard delete user from database
    await User.destroy({ where: { id: delUserId }, force: true });

    const t5Res = await fetch(`${BASE_API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${delAccessToken}` }
    });
    const t5Json = await t5Res.json();
    console.log('Status:', t5Res.status);
    console.log('Message:', t5Json.message);
    if (t5Res.status !== 401 || t5Json.message !== 'User not found.') {
      throw new Error('Test 5 Failed');
    }
    console.log('✓ Test 5 Passed.');

    // ----------------------------------------------------
    // Test 6: Suspended user
    // ----------------------------------------------------
    console.log('\n[TEST 6] Accessing profile with suspended user...');
    // Suspend patient user
    await User.update({ status: 'Suspended' }, { where: { id: patientId } });
    const t6Res = await fetch(`${BASE_API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${patientAccessToken}` }
    });
    const t6Json = await t6Res.json();
    console.log('Status:', t6Res.status);
    console.log('Message:', t6Json.message);
    if (t6Res.status !== 403 || t6Json.message !== 'Your account is inactive or suspended.') {
      throw new Error('Test 6 Failed');
    }
    // Re-activate patient user
    await User.update({ status: 'Active' }, { where: { id: patientId } });
    console.log('✓ Test 6 Passed.');

    // ----------------------------------------------------
    // Test 7: Patient accessing Doctor route
    // ----------------------------------------------------
    console.log('\n[TEST 7] Patient accessing Doctor route...');
    const t7Res = await fetch(`${BASE_API_URL}/doctor/test`, {
      headers: { 'Authorization': `Bearer ${patientAccessToken}` }
    });
    const t7Json = await t7Res.json();
    console.log('Status:', t7Res.status);
    console.log('Message:', t7Json.message);
    if (t7Res.status !== 403 || t7Json.message !== 'You are not authorized to access this resource.') {
      throw new Error('Test 7 Failed');
    }
    console.log('✓ Test 7 Passed.');

    // ----------------------------------------------------
    // Test 8: Doctor accessing Doctor route
    // ----------------------------------------------------
    console.log('\n[TEST 8] Doctor accessing Doctor route...');
    const t8Res = await fetch(`${BASE_API_URL}/doctor/test`, {
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t8Json = await t8Res.json();
    console.log('Status:', t8Res.status);
    console.log('Data:', t8Json.data);
    if (t8Res.status !== 200 || !t8Json.success || t8Json.data.message !== 'Doctor authentication verified.') {
      throw new Error('Test 8 Failed');
    }
    console.log('✓ Test 8 Passed.');

    // ----------------------------------------------------
    // Test 9: Admin accessing Admin route
    // ----------------------------------------------------
    console.log('\n[TEST 9] Admin accessing Admin route...');
    const t9Res = await fetch(`${BASE_API_URL}/admin/test`, {
      headers: { 'Authorization': `Bearer ${adminAccessToken}` }
    });
    const t9Json = await t9Res.json();
    console.log('Status:', t9Res.status);
    console.log('Data:', t9Json.data);
    if (t9Res.status !== 200 || !t9Json.success || t9Json.data.message !== 'Admin authentication verified.') {
      throw new Error('Test 9 Failed');
    }
    console.log('✓ Test 9 Passed.');

    // ----------------------------------------------------
    // Test 10: Logout behavior
    // ----------------------------------------------------
    console.log('\n[TEST 10] Testing logout behavior...');
    // Create new patient login to get new tokens
    const patientLoginRes2 = await fetch(`${BASE_AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmail, password })
    });
    const patientLoginJson2 = await patientLoginRes2.json();
    const testAccessToken = patientLoginJson2.data.accessToken;
    const testRefreshToken = patientLoginJson2.data.refreshToken;

    // Logout
    const logoutRes = await fetch(`${BASE_AUTH_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: testRefreshToken })
    });
    console.log('Logout Status:', logoutRes.status);

    // Reuse existing access token (should still work as it is stateless and valid)
    const accessAfterLogoutRes = await fetch(`${BASE_API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${testAccessToken}` }
    });
    console.log('Access token after logout status (stateless):', accessAfterLogoutRes.status);
    if (accessAfterLogoutRes.status !== 200) {
      throw new Error('Stateless access token should remain valid until natural expiration.');
    }

    // Refresh token should be rejected after logout
    const refreshAfterLogoutRes = await fetch(`${BASE_AUTH_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: testRefreshToken })
    });
    console.log('Refresh token after logout status:', refreshAfterLogoutRes.status);
    if (refreshAfterLogoutRes.status !== 401) {
      throw new Error('Refresh token should be rejected after logout.');
    }
    console.log('✓ Test 10 Passed.');

    console.log('\n=== ALL MIDDLEWARE VERIFICATION TESTS PASSED! ===');
  } catch (error) {
    console.error('\n❌ MIDDLEWARE TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    // Clean up database test records
    console.log('\nCleaning up database test records...');
    try {
      const ids = [patientId, doctorId, adminId];
      for (const id of ids) {
        if (id) {
          await RefreshToken.destroy({ where: { userId: id } });
          await Doctor.destroy({ where: { id } });
          await Patient.destroy({ where: { id } });
          await User.destroy({ where: { id }, force: true });
        }
      }
      console.log('✓ Cleanup complete.');
    } catch (cleanupErr) {
      console.error('Failed to clean up:', cleanupErr.message);
    }
    process.exit(0);
  }
}

// Small delay to let dev server restart
setTimeout(runTests, 1000);
