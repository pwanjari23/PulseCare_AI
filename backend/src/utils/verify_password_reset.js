/**
 * PulseCare AI – Phase 6.4 Verification Tests
 * Forgot & Reset Password Module
 *
 * Run: node src/utils/verify_password_reset.js
 */

const { User, PasswordResetToken, RefreshToken, ActivityLog, Patient } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');
const crypto = require('crypto');
const fetch = require('node-fetch');
const fs = require('fs');

delete process.env.PORT;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const port = process.env.PORT || 5000;
const BASE_API_URL = `http://localhost:${port}/api/v1`;
const BASE_AUTH_URL = `http://localhost:${port}/api/auth`;

let passed = 0;
let failed = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${details ? ` | ${details}` : ''}`);
    failed++;
  }
}

// Read raw token written by the email service in the server process
function readLastSentToken() {
  try {
    const filePath = path.resolve(__dirname, '../../../uploads/last_email_token.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      fs.unlinkSync(filePath); // Clear it after reading
      const url = new URL(data.resetUrl);
      return url.searchParams.get('token');
    }
  } catch (e) {
    console.error('Error reading test token:', e.message);
  }
  return null;
}

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function runTests() {
  console.log('=== Phase 6.4 – Forgot & Reset Password Verification Tests ===\n');

  const ts = Date.now();
  const testEmail = `user_reset_${ts}@example.com`;
  const unknownEmail = `unknown_reset_${ts}@example.com`;
  const oldPassword = 'Password123!';
  const newPassword = 'NewPassword123!';
  
  let userId = null;
  let lastSentToken = null;

  // Clean up any residual token files
  try {
    const tokenPath = path.resolve(__dirname, '../../../uploads/last_email_token.json');
    if (fs.existsSync(tokenPath)) fs.unlinkSync(tokenPath);
  } catch (e) {}

  const cleanup = async () => {
    try {
      if (userId) {
        await PasswordResetToken.destroy({ where: { userId }, force: true }).catch(() => {});
        await RefreshToken.destroy({ where: { userId }, force: true }).catch(() => {});
        await ActivityLog.destroy({ where: { userId }, force: true }).catch(() => {});
        await Patient.destroy({ where: { id: userId }, force: true }).catch(() => {});
        const user = await User.findByPk(userId);
        if (user) await user.destroy({ force: true });
      }
    } catch (e) {
      console.error('Cleanup error:', e.message);
    }
  };

  try {
    // ── Setup ────────────────────────────────────────────────────────────────
    console.log('[SETUP] Creating test user...');
    const passHash = await hashPassword(oldPassword);
    const user = await User.create({
      email: testEmail,
      passwordHash: passHash,
      role: 'Patient',
      status: 'Active',
    });
    userId = user.id;

    await Patient.create({
      id: userId,
      firstName: 'ResetUser',
      lastName: 'Test',
      gender: 'Male',
      dateOfBirth: '1995-05-05',
    });

    assert(!!userId, 'Setup: Test user created successfully');

    // ── Test 1: Forgot password using existing email ─────────────────────────
    console.log('\nTest 1: Forgot password using existing email');
    const t1 = await apiPost(`${BASE_API_URL}/password-reset/forgot`, { email: testEmail });
    assert(t1.status === 200, 'Returns 200 OK');
    assert(t1.data?.data?.message?.includes('instructions have been sent'), 'Generic message matches expected output');
    
    await sleep(350); // wait for async email file write
    lastSentToken = readLastSentToken();
    assert(!!lastSentToken, 'Raw token was captured by mocked email service');
    
    const dbTokenRecord = await PasswordResetToken.findOne({ where: { userId } });
    assert(!!dbTokenRecord, 'PasswordResetToken record created in database');

    // ── Test 2: Forgot password using unknown email ──────────────────────────
    console.log('\nTest 2: Forgot password using unknown email');
    const t2 = await apiPost(`${BASE_API_URL}/password-reset/forgot`, { email: unknownEmail });
    assert(t2.status === 200, 'Returns 200 OK');
    assert(t2.data?.data?.message?.includes('instructions have been sent'), 'Generic message matches exactly');
    
    await sleep(150);
    const unknownToken = readLastSentToken();
    assert(unknownToken === null, 'No email was dispatched for non-existent email');

    // ── Test 3: Reset using valid token ──────────────────────────────────────
    console.log('\nTest 3: Reset using valid token');
    // Generate dummy refresh token first to test revocation
    await RefreshToken.create({ userId, token: `ref_tok_${ts}`, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });

    const capturedToken = dbTokenRecord.tokenHash; // Store hash for database inspection later
    const t3 = await apiPost(`${BASE_API_URL}/password-reset/reset`, {
      token: lastSentToken,
      newPassword,
      confirmPassword: newPassword,
    });
    assert(t3.status === 200, 'Password reset request returns 200 OK', JSON.stringify(t3.data));
    
    const activeTokens = await PasswordResetToken.findAll({ where: { userId } });
    assert(activeTokens.length === 0, 'Reset token removed from database after success');

    const refreshTokens = await RefreshToken.findAll({ where: { userId } });
    assert(refreshTokens.length === 0, 'All refresh tokens revoked/deleted after password reset');

    // ── Test 4: Reuse same token ─────────────────────────────────────────────
    console.log('\nTest 4: Reuse same token');
    const t4 = await apiPost(`${BASE_API_URL}/password-reset/reset`, {
      token: lastSentToken,
      newPassword,
      confirmPassword: newPassword,
    });
    assert(t4.status === 400, 'Reusing token returns 400 Bad Request');
    assert(t4.data?.message?.includes('Invalid or expired'), 'Error message details invalid token');

    // ── Test 5: Expired token ────────────────────────────────────────────────
    console.log('\nTest 5: Expired token');
    // Request new token
    await apiPost(`${BASE_API_URL}/password-reset/forgot`, { email: testEmail });
    await sleep(350);
    const expiredTokenRaw = readLastSentToken();
    // Explicitly expire the token in database
    await PasswordResetToken.update(
      { expiresAt: new Date(Date.now() - 5000) },
      { where: { userId } }
    );

    const t5 = await apiPost(`${BASE_API_URL}/password-reset/reset`, {
      token: expiredTokenRaw,
      newPassword,
      confirmPassword: newPassword,
    });
    assert(t5.status === 400, 'Expired token returns 400 Bad Request');
    assert(t5.data?.message?.includes('expired'), 'Error message states token is expired');

    // ── Test 6: Weak password ────────────────────────────────────────────────
    console.log('\nTest 6: Weak password');
    const t6 = await apiPost(`${BASE_API_URL}/password-reset/reset`, {
      token: expiredTokenRaw,
      newPassword: '123',
      confirmPassword: '123',
    });
    assert(t6.status === 400, 'Weak password returns 400 Bad Request');

    // ── Test 7: Mismatched confirm password ──────────────────────────────────
    console.log('\nTest 7: Mismatched confirm password');
    const t7 = await apiPost(`${BASE_API_URL}/password-reset/reset`, {
      token: expiredTokenRaw,
      newPassword,
      confirmPassword: 'Mismatch123!',
    });
    assert(t7.status === 400, 'Mismatched confirmation returns 400 Bad Request');

    // ── Test 8: Login with old password ──────────────────────────────────────
    console.log('\nTest 8: Login with old password');
    const t8 = await apiPost(`${BASE_AUTH_URL}/login`, { email: testEmail, password: oldPassword });
    assert(t8.status === 401 || t8.status === 400, 'Old password login is rejected');

    // ── Test 9: Login with new password ──────────────────────────────────────
    console.log('\nTest 9: Login with new password');
    const t9 = await apiPost(`${BASE_AUTH_URL}/login`, { email: testEmail, password: newPassword });
    assert(t9.status === 200, 'New password login succeeds');
    assert(!!t9.data?.data?.accessToken, 'Token generated successfully');

    // ── Test 10: Verify activity logs ────────────────────────────────────────
    console.log('\nTest 10: Verify Activity Logs');
    const reqLogs = await ActivityLog.findAll({ where: { userId, action: 'PASSWORD_RESET_REQUESTED' } });
    const compLogs = await ActivityLog.findAll({ where: { userId, action: 'PASSWORD_RESET_COMPLETED' } });
    assert(reqLogs.length > 0, 'PASSWORD_RESET_REQUESTED log exists in database');
    assert(compLogs.length > 0, 'PASSWORD_RESET_COMPLETED log exists in database');

    // ── Test 11: Transaction rollback on failure ─────────────────────────────
    console.log('\nTest 11: Transaction rollback on failure');
    await apiPost(`${BASE_API_URL}/password-reset/forgot`, { email: testEmail });
    await sleep(350);
    const rollbackTokenRaw = readLastSentToken();

    // Create dummy refresh token
    await RefreshToken.create({ userId, token: `rollback_ref_${ts}`, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });

    try {
      await apiPost(`${BASE_API_URL}/password-reset/reset`, {
        token: rollbackTokenRaw,
        newPassword: 'ForceRollback123!',
        confirmPassword: 'ForceRollback123!',
      });
    } catch (e) {
      // Catch client/api error
    }

    // Verify state remained intact
    const userState = await User.findByPk(userId);
    const passwordMatchedNew = await require('../auth/utils/password').comparePassword('ForceRollback123!', userState.passwordHash);
    assert(!passwordMatchedNew, 'Password unchanged (rollback succeeded)');

    const rollbackTokenExists = await PasswordResetToken.findOne({ where: { userId } });
    assert(!!rollbackTokenExists, 'Reset token remains active (rollback succeeded)');

    const rollbackRefreshTokens = await RefreshToken.findAll({ where: { userId } });
    assert(rollbackRefreshTokens.length > 0, 'Refresh tokens kept intact (rollback succeeded)');

    // ── Test 12: Database inspection (Secure Hashing verification) ────────────
    console.log('\nTest 12: Database inspection (Secure Hashing)');
    const currentTokenRecord = await PasswordResetToken.findOne({ where: { userId } });
    if (currentTokenRecord) {
      const plaintextToken = rollbackTokenRaw;
      const storedHash = currentTokenRecord.tokenHash;
      assert(plaintextToken !== storedHash, 'Stored token hash does not match plaintext raw token');
      
      const computedHash = crypto.createHash('sha256').update(plaintextToken).digest('hex');
      assert(storedHash === computedHash, 'Stored token hash is the SHA-256 hash of raw token');
      assert(storedHash.length === 64, 'Stored token is a 64-character SHA-256 hex string');
    } else {
      assert(false, 'Reset token found for database inspection');
    }

  } catch (err) {
    console.error('\n🚨 Unexpected test error:', err.message, err.stack);
    failed++;
  } finally {
    console.log('\n[CLEANUP] Removing test data...');
    await cleanup();
    await sequelize.close();

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    if (failed === 0) {
      console.log('🎉 All Phase 6.4 Password Reset tests PASSED!');
    } else {
      console.log('⚠️  Some tests failed. Review output above.');
      process.exit(1);
    }
  }
}

runTests();
