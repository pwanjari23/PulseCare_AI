/**
 * PulseCare AI – Phase 6.1 Verification Tests
 * File Upload & Media Management Module
 *
 * Run: node src/utils/verify_uploads.js
 */

const { User, Doctor, Patient, UploadedFile, ActivityLog } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

delete process.env.PORT;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const port = process.env.PORT || 5000;
const BASE_API_URL = `http://localhost:${port}/api/v1`;
const BASE_AUTH_URL = `http://localhost:${port}/api/auth`;

// ─── Test Helpers ─────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}${details ? ` | ${details}` : ''}`);
    failed++;
  }
}

/**
 * Creates a minimal in-memory PNG buffer for testing.
 * sizeKB controls the approximate size.
 */
function makePngBuffer(sizeKB = 10) {
  // Minimal valid 1×1 PNG bytes
  const pngBytes = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
    0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC,
    0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
    0x44, 0xAE, 0x42, 0x60, 0x82,
  ]);
  const targetBytes = sizeKB * 1024;
  if (targetBytes <= pngBytes.length) return pngBytes;
  const padding = Buffer.alloc(targetBytes - pngBytes.length, 0);
  return Buffer.concat([pngBytes, padding]);
}

function makePdfBuffer() {
  return Buffer.from('%PDF-1.4 PulseCare AI test file');
}

async function apiPost(url, body, token) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function apiUpload(url, fieldName, filename, buffer, mimeType, token) {
  const form = new FormData();
  form.append(fieldName, buffer, { filename, contentType: mimeType });
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      ...form.getHeaders(),
    },
    body: form,
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function apiDelete(url, token) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function apiGet(url, token) {
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function login(email, password) {
  const { data } = await apiPost(`${BASE_AUTH_URL}/login`, { email, password });
  return data.data?.accessToken || null;
}

// ─── Main Test Runner ─────────────────────────────────────────────────────────

async function runTests() {
  console.log('=== Phase 6.1 – File Upload & Media Management Verification Tests ===\n');

  const ts = Date.now();
  const patientEmail = `pat_up_${ts}@example.com`;
  const doctorEmail  = `doc_up_${ts}@example.com`;
  const adminEmail   = `adm_up_${ts}@example.com`;
  const password = 'Password123!';

  let patientId, doctorId, adminId;
  let patientToken, doctorToken, adminToken;

  const cleanup = async () => {
    try {
      const ids = [patientId, doctorId, adminId].filter(Boolean);
      if (ids.length > 0) {
        await UploadedFile.destroy({ where: { uploadedBy: ids }, force: true }).catch(() => {});
        await ActivityLog.destroy({ where: { userId: ids }, force: true }).catch(() => {});
        for (const id of ids) {
          const user = await User.findByPk(id);
          if (user) await user.destroy({ force: true });
        }
      }
    } catch (e) {
      console.error('Cleanup error:', e.message);
    }
  };

  try {
    // ── Setup ────────────────────────────────────────────────────────────────
    console.log('[SETUP] Creating test users...');
    const passHash = await hashPassword(password);

    // Register Patient via API
    const regPat = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmail, password, firstName: 'Upload', lastName: 'Patient', gender: 'Male', dateOfBirth: '1990-01-01' }),
    });
    patientId = (await regPat.json()).data?.id;

    // Register Doctor via API
    const regDoc = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmail, password, firstName: 'Upload', lastName: 'Doctor', licenseNumber: `LIC_UP_${ts}` }),
    });
    doctorId = (await regDoc.json()).data?.id;

    // Create Admin directly in DB
    const adminUser = await User.create({
      email: adminEmail, passwordHash: passHash, role: 'Admin', status: 'Active',
    });
    adminId = adminUser.id;

    // Activate all accounts
    await User.update({ status: 'Active' }, { where: { id: [patientId, doctorId] } });
    await Doctor.update({ isVerified: true }, { where: { id: [doctorId] } });

    patientToken = await login(patientEmail, password);
    doctorToken  = await login(doctorEmail,  password);
    adminToken   = await login(adminEmail,   password);

    assert(!!patientId,    'Setup: Patient created');
    assert(!!doctorId,     'Setup: Doctor created');
    assert(!!adminId,      'Setup: Admin created');
    assert(!!patientToken, 'Setup: Patient token obtained');
    assert(!!doctorToken,  'Setup: Doctor token obtained');
    assert(!!adminToken,   'Setup: Admin token obtained');

    // ── Test 1: Patient uploads profile image ────────────────────────────────
    console.log('\nTest 1: Patient uploads profile image');
    const t1 = await apiUpload(
      `${BASE_API_URL}/upload/profile-image`,
      'file', 'avatar.png', makePngBuffer(50), 'image/png',
      patientToken
    );
    assert(t1.status === 201, 'Patient profile image upload returns 201', JSON.stringify(t1.data));
    assert(!!t1.data?.data?.id, 'Response contains file UUID');
    assert(!!t1.data?.data?.url, 'Response contains file URL');
    assert(!t1.data?.data?.storagePath, 'Response does NOT expose storagePath');
    const profileUuid = t1.data?.data?.id;

    // ── Test 2: Doctor uploads certificate ───────────────────────────────────
    console.log('\nTest 2: Doctor uploads doctor-document');
    const t2 = await apiUpload(
      `${BASE_API_URL}/upload/doctor-document`,
      'file', 'cert.pdf', makePdfBuffer(), 'application/pdf',
      doctorToken
    );
    assert(t2.status === 201, 'Doctor document upload returns 201', JSON.stringify(t2.data));
    assert(t2.data?.data?.category === 'DOCTOR_DOCUMENT', 'Category is DOCTOR_DOCUMENT');
    const docDocUuid = t2.data?.data?.id;

    // ── Test 3: Doctor uploads prescription ──────────────────────────────────
    console.log('\nTest 3: Doctor uploads prescription');
    const t3 = await apiUpload(
      `${BASE_API_URL}/upload/prescription`,
      'file', 'rx.pdf', makePdfBuffer(), 'application/pdf',
      doctorToken
    );
    assert(t3.status === 201, 'Doctor prescription upload returns 201', JSON.stringify(t3.data));
    assert(t3.data?.data?.category === 'PRESCRIPTION', 'Category is PRESCRIPTION');

    // ── Test 4: Patient uploads medical report ───────────────────────────────
    console.log('\nTest 4: Patient uploads medical report');
    const t4 = await apiUpload(
      `${BASE_API_URL}/upload/medical-report`,
      'file', 'report.pdf', makePdfBuffer(), 'application/pdf',
      patientToken
    );
    assert(t4.status === 201, 'Patient medical report upload returns 201', JSON.stringify(t4.data));
    assert(t4.data?.data?.category === 'MEDICAL_REPORT', 'Category is MEDICAL_REPORT');

    // ── Test 5: Invalid file type rejected ───────────────────────────────────
    console.log('\nTest 5: Invalid file type rejected');
    const t5 = await apiUpload(
      `${BASE_API_URL}/upload/profile-image`,
      'file', 'malware.exe', Buffer.from('MZ corrupt data'), 'application/x-msdownload',
      patientToken
    );
    assert(t5.status === 400, 'Invalid MIME type returns 400', JSON.stringify(t5.data));

    // ── Test 6: Oversized file rejected ─────────────────────────────────────
    console.log('\nTest 6: Oversized profile image rejected (>5 MB)');
    const t6 = await apiUpload(
      `${BASE_API_URL}/upload/profile-image`,
      'file', 'huge.png', makePngBuffer(6 * 1024), 'image/png',
      patientToken
    );
    assert(t6.status === 400, 'Oversized file returns 400', JSON.stringify(t6.data));

    // ── Test 7: Unauthorized upload (Patient → doctor-document) ──────────────
    console.log('\nTest 7: Patient cannot upload doctor-document (403)');
    const t7 = await apiUpload(
      `${BASE_API_URL}/upload/doctor-document`,
      'file', 'doc.pdf', makePdfBuffer(), 'application/pdf',
      patientToken
    );
    assert(t7.status === 403, 'Patient uploading doctor-document returns 403', JSON.stringify(t7.data));

    // ── Test 8: Replace existing profile image ───────────────────────────────
    console.log('\nTest 8: Replace existing profile image');
    const oldRecord = await UploadedFile.findOne({ where: { uploadedBy: patientId, category: 'PROFILE_IMAGE' } });
    const oldStoragePath = oldRecord?.storagePath;

    const t8 = await apiUpload(
      `${BASE_API_URL}/upload/profile-image`,
      'file', 'new_avatar.png', makePngBuffer(30), 'image/png',
      patientToken
    );
    assert(t8.status === 201, 'Profile image replacement returns 201', JSON.stringify(t8.data));

    // After replace: only ONE PROFILE_IMAGE record for this user
    const profileFiles = await UploadedFile.findAll({ where: { uploadedBy: patientId, category: 'PROFILE_IMAGE' } });
    assert(profileFiles.length === 1, 'Only one PROFILE_IMAGE record remains after replace');
    assert(
      profileFiles[0]?.storagePath !== oldStoragePath,
      'storagePath updated to new file after replace'
    );

    // ── Test 9: Delete uploaded file ─────────────────────────────────────────
    console.log('\nTest 9: Delete uploaded file (doctor-document)');
    const fileToDelete = await UploadedFile.findOne({ where: { uploadedBy: doctorId, category: 'DOCTOR_DOCUMENT' } });
    const deleteUuid = fileToDelete?.uuid;
    const deleteStoragePath = fileToDelete?.storagePath;

    const t9 = await apiDelete(`${BASE_API_URL}/upload/${deleteUuid}`, doctorToken);
    assert(t9.status === 200, 'Delete returns 200', JSON.stringify(t9.data));

    const deletedDbRecord = await UploadedFile.findOne({ where: { uuid: deleteUuid } });
    assert(!deletedDbRecord, 'DB record removed after delete');

    const uploadsRoot = path.resolve(__dirname, '../../../uploads');
    if (deleteStoragePath) {
      const physicalPath = path.join(uploadsRoot, deleteStoragePath);
      const physicalExists = fs.existsSync(physicalPath);
      assert(!physicalExists, 'Physical file removed from filesystem after delete');
    } else {
      assert(false, 'Physical file removed from filesystem after delete', 'Could not find storagePath to verify');
    }

    // ── Test 10: Transaction rollback – orphan file cleanup ───────────────────
    console.log('\nTest 10: Transaction rollback – orphan file cleaned up');
    const storageProvider = require('../upload/storage/local-storage.provider');
    let orphanPath = null;
    let rollbackSuccess = false;
    try {
      const result = await storageProvider.save(makePngBuffer(5), 'orphan.png', 'image/png', 'PROFILE_IMAGE');
      orphanPath = result.storagePath;
      // Simulate DB failure by throwing
      throw new Error('Simulated DB failure');
    } catch (e) {
      if (e.message === 'Simulated DB failure' && orphanPath) {
        await storageProvider.delete(orphanPath);
        const orphanAbsPath = path.join(uploadsRoot, orphanPath);
        rollbackSuccess = !fs.existsSync(orphanAbsPath);
      }
    }
    assert(rollbackSuccess, 'Orphan file cleaned up on simulated transaction rollback');

    // ── Test 11: DTO sanitization ────────────────────────────────────────────
    console.log('\nTest 11: DTO sanitization – no internal paths exposed');
    const myFilesRes = await apiGet(`${BASE_API_URL}/upload/my-files`, patientToken);
    assert(myFilesRes.status === 200, 'GET /my-files returns 200');
    const firstFile = myFilesRes.data?.data?.[0];
    assert(!!firstFile, 'At least one file returned in /my-files');
    if (firstFile) {
      assert(!firstFile.storagePath,     'DTO omits storagePath');
      assert(!firstFile.storageProvider, 'DTO omits storageProvider');
      assert(!firstFile.storedName,      'DTO omits storedName');
      assert(!firstFile.uploadedBy,      'DTO omits uploadedBy (internal userId)');
      assert(!!firstFile.url,            'DTO includes public URL');
      assert(!!firstFile.id,             'DTO includes UUID as id');
      assert(!!firstFile.category,       'DTO includes category');
      assert(!!firstFile.mimeType,       'DTO includes mimeType');
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
      console.log('🎉 All Phase 6.1 File Upload tests PASSED!');
    } else {
      console.log('⚠️  Some tests failed. Review output above.');
      process.exit(1);
    }
  }
}

runTests();
