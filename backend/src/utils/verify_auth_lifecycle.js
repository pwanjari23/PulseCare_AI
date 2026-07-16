const { User, RefreshToken, ActivityLog } = require('../models');
const { sequelize } = require('../models');

const BASE_URL = 'http://localhost:5000/api/auth';

async function runTests() {
  console.log('=== Starting Auth Lifecycle Verification Tests ===');
  const email = `verify_${Date.now()}@example.com`;
  const password = 'Password123!';
  let userId;
  let firstAccessToken;
  let firstRefreshToken;
  let secondAccessToken;
  let secondRefreshToken;

  try {
    // 1. Register Patient
    console.log('\n[TEST 1] Registering test patient...');
    const registerRes = await fetch(`${BASE_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName: 'Verify',
        lastName: 'Lifecycle',
        gender: 'Male',
        dateOfBirth: '1990-01-01'
      })
    });
    const registerJson = await registerRes.json();
    if (!registerJson.success) {
      throw new Error(`Registration failed: ${JSON.stringify(registerJson)}`);
    }
    userId = registerJson.data.id;
    console.log(`Registered user successfully: ID ${userId}, Email ${email}`);

    // 2. Login
    console.log('\n[TEST 2] Logging in user...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginJson = await loginRes.json();
    if (!loginJson.success) {
      throw new Error(`Login failed: ${JSON.stringify(loginJson)}`);
    }
    firstAccessToken = loginJson.data.accessToken;
    firstRefreshToken = loginJson.data.refreshToken;
    console.log('Login response data keys:', Object.keys(loginJson.data));
    console.log('Login response user keys:', Object.keys(loginJson.data.user));
    
    // Assert response DTO fields
    if (loginJson.data.user.passwordHash || loginJson.data.user.password_hash) {
      throw new Error('Security Leak: passwordHash exposed in login response!');
    }
    console.log('✓ Login response DTO is clean.');

    // 3. Successful Refresh (Rotation)
    console.log('\n[TEST 3] Calling /refresh to rotate token...');
    
    // Print DB before refresh
    const dbTokensBefore = await RefreshToken.findAll({ where: { userId } });
    console.log('DB Refresh Tokens BEFORE refresh:', dbTokensBefore.map(t => ({ id: t.id, token: t.token, expiresAt: t.expiresAt })));

    const refreshRes = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: firstRefreshToken })
    });
    const refreshJson = await refreshRes.json();
    if (!refreshJson.success) {
      throw new Error(`Refresh failed: ${JSON.stringify(refreshJson)}`);
    }
    secondAccessToken = refreshJson.data.accessToken;
    secondRefreshToken = refreshJson.data.refreshToken;
    console.log('Refresh response data keys:', Object.keys(refreshJson.data));
    console.log('Refresh response user keys:', Object.keys(refreshJson.data.user));
    console.log('ExpiresIn:', refreshJson.data.expiresIn);
    
    // Print DB after refresh
    const dbTokensAfter = await RefreshToken.findAll({ where: { userId } });
    console.log('DB Refresh Tokens AFTER refresh:', dbTokensAfter.map(t => ({ id: t.id, token: t.token, expiresAt: t.expiresAt })));

    if (!secondAccessToken || !secondRefreshToken || !refreshJson.data.expiresIn) {
      throw new Error('Refresh response missing required parameters!');
    }
    if (refreshJson.data.user.passwordHash || refreshJson.data.user.password_hash) {
      throw new Error('Security Leak: passwordHash exposed in refresh response!');
    }
    console.log('✓ Successful Refresh completed.');

    // 4. Rotation Verification: Attempt using the OLD refresh token
    console.log('\n[TEST 4] Attempting to refresh with the rotated (OLD) refresh token...');
    const replayRes = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: firstRefreshToken })
    });
    const replayJson = await replayRes.json();
    console.log('Replay Response status:', replayRes.status);
    console.log('Replay Response body:', replayJson);
    if (replayRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for replaying rotated token, got ${replayRes.status}`);
    }
    console.log('✓ Replaying rotated token was successfully blocked with 401.');

    // 5. Database Verification: Check only one token exists in the database
    console.log('\n[TEST 5] Checking database refresh tokens count...');
    const dbTokens = await RefreshToken.findAll({ where: { userId } });
    console.log(`Database refresh tokens count for user: ${dbTokens.length}`);
    if (dbTokens.length !== 1) {
      throw new Error(`Expected exactly 1 refresh token in DB for user, found ${dbTokens.length}`);
    }
    if (dbTokens[0].token !== secondRefreshToken) {
      throw new Error('The token in database does not match the active rotated refresh token!');
    }
    console.log('✓ Only the single active rotated refresh token exists in DB.');

    // 6. Suspended User
    console.log('\n[TEST 6] Testing suspended user access...');
    // Suspend user in DB
    await User.update({ status: 'Suspended' }, { where: { id: userId } });
    
    const suspendedRes = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: secondRefreshToken })
    });
    const suspendedJson = await suspendedRes.json();
    console.log('Suspended user refresh response status:', suspendedRes.status);
    console.log('Suspended user refresh response body:', suspendedJson);
    if (suspendedRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden for suspended user refresh, got ${suspendedRes.status}`);
    }
    console.log('✓ Suspended user was blocked with 403.');
    
    // Reactivate user in DB
    await User.update({ status: 'Active' }, { where: { id: userId } });

    // 7. Invalid Signature
    console.log('\n[TEST 7] Testing invalid token signature...');
    const invalidSignatureRes = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: secondRefreshToken + 'xyz' })
    });
    const invalidSignatureJson = await invalidSignatureRes.json();
    console.log('Invalid signature refresh response status:', invalidSignatureRes.status);
    console.log('Invalid signature refresh response body:', invalidSignatureJson);
    if (invalidSignatureRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for invalid signature, got ${invalidSignatureRes.status}`);
    }
    console.log('✓ Invalid signature was blocked with 401.');

    // 8. Logout Verification
    console.log('\n[TEST 8] Logging out...');
    const logoutRes = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: secondRefreshToken })
    });
    const logoutJson = await logoutRes.json();
    console.log('Logout response status:', logoutRes.status);
    console.log('Logout response body:', logoutJson);
    if (logoutRes.status !== 200 || !logoutJson.success) {
      throw new Error('Logout request failed!');
    }

    // Verify token is deleted in DB
    const dbTokensAfterLogout = await RefreshToken.findAll({ where: { userId } });
    console.log(`Tokens in database after logout: ${dbTokensAfterLogout.length}`);
    if (dbTokensAfterLogout.length !== 0) {
      throw new Error(`Expected 0 tokens in DB after logout, found ${dbTokensAfterLogout.length}`);
    }

    // Verify refresh with logged out token fails
    const loggedOutRefreshRes = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: secondRefreshToken })
    });
    console.log('Refresh with logged out token status:', loggedOutRefreshRes.status);
    if (loggedOutRefreshRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for logged out refresh, got ${loggedOutRefreshRes.status}`);
    }
    console.log('✓ Logout and subsequent invalidation verified successfully.');

    // 9. Audit Log Verification
    console.log('\n[TEST 9] Verifying audit logs in database...');
    const logs = await ActivityLog.findAll({
      where: { userId },
      order: [['created_at', 'ASC']]
    });

    console.log(`Found ${logs.length} activity logs for user:`);
    logs.forEach(log => {
      console.log(`- Action: ${log.action}, IP: ${log.ipAddress}, UA: ${log.userAgent}`);
    });

    const actions = logs.map(l => l.action);
    const expectedActions = ['PATIENT_REGISTERED', 'LOGIN_SUCCESS', 'LOGIN_REFRESH', 'REFRESH_TOKEN_REVOKED', 'LOGOUT'];
    
    for (const action of expectedActions) {
      if (!actions.includes(action)) {
        throw new Error(`Expected activity log to contain action: ${action}`);
      }
    }
    console.log('✓ All expected audit logs exist and are correctly populated.');

    console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    // Clean up database test records
    console.log('\nCleaning up database test records...');
    try {
      if (userId) {
        await RefreshToken.destroy({ where: { userId } });
        await ActivityLog.destroy({ where: { userId } });
        // Soft-deleted user since paranoid: true is enabled
        await User.destroy({ where: { id: userId } });
        // Hard delete patient profile/user to prevent database bloat
        await sequelize.query(`DELETE FROM patients WHERE id = ${userId}`);
        await sequelize.query(`DELETE FROM users WHERE id = ${userId}`);
        console.log('✓ Cleanup complete.');
      }
    } catch (cleanupErr) {
      console.error('Failed to clean up:', cleanupErr.message);
    }
    process.exit(0);
  }
}

// Introduce short delay to let dev server reload completely if needed
setTimeout(runTests, 1000);
