const { User, RefreshToken, Doctor, Patient, VitalsLog, VitalsAlert, ActivityLog } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');
const vitalService = require('../vitals/services/vital.service');

delete process.env.PORT;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const port = process.env.PORT || 5000;
const BASE_API_URL = `http://localhost:${port}/api/v1`;
const BASE_AUTH_URL = `http://localhost:${port}/api/auth`;

async function runTests() {
  console.log('=== Starting Phase 5.5 Vital Signs Management Verification Tests ===');

  const timestamp = Date.now();
  const patientEmailA = `patient_a_vt_${timestamp}@example.com`;
  const patientEmailB = `patient_b_vt_${timestamp}@example.com`;
  const doctorEmail = `doctor_vt_${timestamp}@example.com`;
  const adminEmail = `admin_vt_${timestamp}@example.com`;
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
        email: doctorEmail, password, firstName: 'DrSarah', lastName: 'Test', licenseNumber: `LIC_VT_${timestamp}`
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

    // ----------------------------------------------------
    // Test 1: Patient records normal vitals successfully
    // ----------------------------------------------------
    console.log('\n[TEST 1] Patient A logging normal vitals (POST /vitals)...');
    const t1Res = await fetch(`${BASE_API_URL}/vitals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patientAccessTokenA}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        heartRate: 75,
        spo2: 98,
        temperature: 36.6,
        systolicBp: 120,
        diastolicBp: 80,
        glucose: 90,
        weightKg: 70.0,
        heightCm: 175.0
      })
    });
    const t1Json = await t1Res.json();
    console.log('Status:', t1Res.status);
    console.log('alertGenerated:', t1Json.data.alertGenerated);
    console.log('Calculated BMI:', t1Json.data.bmi);

    if (t1Res.status !== 201 || t1Json.data.alertGenerated !== false || t1Json.data.bmi !== 22.9) {
      throw new Error('Test 1 / Test 2 Failed: BMI or alert mismatch');
    }
    const vitalRecordId = t1Json.data.id;
    console.log('✓ Test 1 (Normal Vitals) & Test 2 (BMI Calculation) Passed.');

    // ----------------------------------------------------
    // Test 3: Abnormal vitals create alert
    // ----------------------------------------------------
    console.log('\n[TEST 3] Patient A logging abnormal vitals (Expect alertGenerated: true)...');
    const t3Res = await fetch(`${BASE_API_URL}/vitals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patientAccessTokenA}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        heartRate: 135, // Abnormal (high)
        spo2: 88,      // Abnormal (low SpO2)
        temperature: 39.5, // Abnormal (fever)
        systolicBp: 150,
        diastolicBp: 95,
        glucose: 110,
        weightKg: 70.0,
        heightCm: 175.0
      })
    });
    const t3Json = await t3Res.json();
    console.log('Status:', t3Res.status);
    console.log('alertGenerated:', t3Json.data.alertGenerated);

    // Verify DB alert row
    const dbAlert = await VitalsAlert.findOne({ where: { vitalsLogId: t3Json.data.id } });
    console.log('VitalsAlert DB entry created:', !!dbAlert);

    if (t3Res.status !== 201 || t3Json.data.alertGenerated !== true || !dbAlert) {
      throw new Error('Test 3 Failed: Alert not generated for abnormal readings');
    }
    console.log('✓ Test 3 Passed.');

    // ----------------------------------------------------
    // Test 4: Retrieve Patient history
    // ----------------------------------------------------
    console.log('\n[TEST 4] Patient A retrieving history of logged vitals (GET /vitals/me)...');
    const t4Res = await fetch(`${BASE_API_URL}/vitals/me`, {
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}` }
    });
    const t4Json = await t4Res.json();
    console.log('Status:', t4Res.status);
    console.log('List count:', t4Json.data.length);
    if (t4Res.status !== 200 || t4Json.data.length !== 2) {
      throw new Error('Test 4 Failed');
    }
    console.log('✓ Test 4 Passed.');

    // ----------------------------------------------------
    // Test 5: Retrieve Latest vital record
    // ----------------------------------------------------
    console.log('\n[TEST 5] Patient A retrieving latest vital record (GET /vitals/latest)...');
    const t5Res = await fetch(`${BASE_API_URL}/vitals/latest`, {
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}` }
    });
    const t5Json = await t5Res.json();
    console.log('Status:', t5Res.status);
    console.log('Latest heartRate (expected 135):', t5Json.data.heartRate);
    if (t5Res.status !== 200 || t5Json.data.heartRate !== 135) {
      throw new Error('Test 5 Failed');
    }
    console.log('✓ Test 5 Passed.');

    // ----------------------------------------------------
    // Test 6: Doctor retrieves assigned patient's vitals
    // ----------------------------------------------------
    console.log('\n[TEST 6] Easing doctor connection and retrieving patient vitals...');
    // Create connection: Doctor connects with Patient A as primary doctor
    await Patient.update({ primaryDoctorId: doctorId }, { where: { id: patientIdA } });

    const t6Res = await fetch(`${BASE_API_URL}/vitals/patient/${patientIdA}`, {
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t6Json = await t6Res.json();
    console.log('Status:', t6Res.status);
    console.log('Doctor query result size:', t6Json.data.length);
    if (t6Res.status !== 200 || t6Json.data.length !== 2) {
      throw new Error('Test 6 Failed');
    }
    console.log('✓ Test 6 Passed.');

    // ----------------------------------------------------
    // Test 7: Doctor cannot retrieve unrelated patient
    // ----------------------------------------------------
    console.log('\n[TEST 7] Doctor Sarah querying Patient B (unrelated, Expect 403)...');
    const t7Res = await fetch(`${BASE_API_URL}/vitals/patient/${patientIdB}`, {
      headers: { 'Authorization': `Bearer ${doctorAccessToken}` }
    });
    const t7Json = await t7Res.json();
    console.log('Status:', t7Res.status);
    console.log('Message:', t7Json.message);
    if (t7Res.status !== 403) {
      throw new Error('Test 7 Failed: Doctor could access unrelated patient details');
    }
    console.log('✓ Test 7 Passed.');

    // ----------------------------------------------------
    // Test 8: Admin retrieves any patient's vitals
    // ----------------------------------------------------
    console.log('\n[TEST 8] Admin retrieving Patient B\'s vitals...');
    const t8Res = await fetch(`${BASE_API_URL}/vitals/patient/${patientIdB}`, {
      headers: { 'Authorization': `Bearer ${adminAccessToken}` }
    });
    const t8Json = await t8Res.json();
    console.log('Status:', t8Res.status);
    if (t8Res.status !== 200) {
      throw new Error('Test 8 Failed');
    }
    console.log('✓ Test 8 Passed.');

    // ----------------------------------------------------
    // Test 9: Update vital signs
    // ----------------------------------------------------
    console.log('\n[TEST 9] Patient A updating vital sign entry...');
    const t9Res = await fetch(`${BASE_API_URL}/vitals/${vitalRecordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${patientAccessTokenA}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        heartRate: 88, // updated
        spo2: 99,
        temperature: 36.8,
        systolicBp: 115,
        diastolicBp: 78,
        glucose: 95,
        weightKg: 72.0,
        heightCm: 175.0
      })
    });
    const t9Json = await t9Res.json();
    console.log('Status:', t9Res.status);
    console.log('Updated Heart Rate:', t9Json.data.heartRate);

    const dbLogVal = await VitalsLog.findByPk(vitalRecordId);
    console.log('DB Heart Rate:', dbLogVal.heartRate);

    if (t9Res.status !== 200 || dbLogVal.heartRate !== 88) {
      throw new Error('Test 9 Failed');
    }
    console.log('✓ Test 9 Passed.');

    // ----------------------------------------------------
    // Test 10: Validation failures
    // ----------------------------------------------------
    console.log('\n[TEST 10] Rejecting invalid vital values (Expect 400)...');
    const t10Res = await fetch(`${BASE_API_URL}/vitals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${patientAccessTokenA}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        heartRate: 500, // Invalid
        spo2: 25,       // Invalid
        temperature: 99.0, // Invalid
        systolicBp: 20, // Invalid
        diastolicBp: 10
      })
    });
    console.log('Status:', t10Res.status);
    if (t10Res.status !== 400) {
      throw new Error('Test 10 Failed: Invalid values accepted');
    }
    console.log('✓ Test 10 Passed.');

    // ----------------------------------------------------
    // Test 11: DTO Sanitization
    // ----------------------------------------------------
    console.log('\n[TEST 11] Checking DTO keys to confirm no security leaks...');
    const sensitiveKeys = ['deletedAt', 'passwordHash'];
    for (const key of sensitiveKeys) {
      if (t1Json.data[key] !== undefined || t3Json.data[key] !== undefined) {
        throw new Error(`Security Leak: Sanitized DTO contained key ${key}`);
      }
    }
    console.log('✓ Test 11 Passed.');

    // ----------------------------------------------------
    // Test 12: Activity Logs & Alert Logs
    // ----------------------------------------------------
    console.log('\n[TEST 12] Verifying activity logs output counts...');
    const recLogs = await ActivityLog.findAll({ where: { userId: patientIdA, action: 'VITAL_RECORDED' } });
    const alertLogs = await ActivityLog.findAll({ where: { userId: patientIdA, action: 'VITAL_ALERT_CREATED' } });

    console.log('VITAL_RECORDED logs count:', recLogs.length);
    console.log('VITAL_ALERT_CREATED logs count:', alertLogs.length);

    if (recLogs.length !== 2 || alertLogs.length !== 1) {
      throw new Error('Test 12 Failed: Logs mismatch');
    }
    console.log('✓ Test 12 Passed.');

    // ----------------------------------------------------
    // Test 13: Transaction rollback on DB failure
    // ----------------------------------------------------
    console.log('\n[TEST 13] Verifying transaction rollback on DB save error...');
    // Destroy logs to count cleanly
    await ActivityLog.destroy({ where: { entity: 'VitalsLog' } });

    let rollbackSuccess = false;
    try {
      // Force database error by bypass-calling service with invalid string status
      await vitalService.recordVital(patientIdA, {
        heartRate: 150, // abnormal -> attempts to write alert
        spo2: 95,
        temperature: 37.0,
        systolicBp: 120,
        diastolicBp: 80,
        glucose: 'bypassing_val'
      });
    } catch (e) {
      rollbackSuccess = true;
      console.log('Service threw DB error:', e.message);
    }

    const recLogsAfter = await ActivityLog.findAll({ where: { entity: 'VitalsLog' } });
    console.log('Logs written for failed transaction:', recLogsAfter.length);

    if (!rollbackSuccess || recLogsAfter.length !== 0) {
      throw new Error('Test 13 Failed: Transaction rollback was not executed');
    }
    console.log('✓ Test 13 Passed.');

    // ----------------------------------------------------
    // Test 14: Delete vital record
    // ----------------------------------------------------
    console.log('\n[TEST 14] Patient deleting vital signs record...');
    const t14Res = await fetch(`${BASE_API_URL}/vitals/${vitalRecordId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${patientAccessTokenA}` }
    });
    console.log('Delete status:', t14Res.status);

    const dbLogAfterDel = await VitalsLog.findByPk(vitalRecordId);
    console.log('Record exists after delete:', !!dbLogAfterDel);

    if (t14Res.status !== 200 || dbLogAfterDel) {
      throw new Error('Test 14 Failed: Delete failed');
    }
    console.log('✓ Test 14 Passed.');

    console.log('\n=== ALL VITAL SIGNS MANAGEMENT MODULE TESTS PASSED! ===');
  } catch (error) {
    console.error('\n❌ VERIFICATION TEST FAILED:', error.message);
    process.exit(1);
  } finally {
    console.log('\nCleaning up database test records...');
    try {
      // Clean alerts and logs
      await VitalsAlert.destroy({ where: { patientId: [patientIdA, patientIdB] }, force: true });
      await VitalsLog.destroy({ where: { patientId: [patientIdA, patientIdB] }, force: true });

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
