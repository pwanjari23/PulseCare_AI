const { User, Doctor, Patient, Prescription, PrescriptionItem, Notification, ActivityLog } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');

delete process.env.PORT;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const port = process.env.PORT || 5000;
const BASE_API_URL = `http://localhost:${port}/api/v1`;
const BASE_AUTH_URL = `http://localhost:${port}/api/auth`;

async function runTests() {
  console.log('=== Starting Prescription Management Verification Tests (Phase 5.8) ===\n');

  const timestamp = Date.now();
  const patientEmail = `pat_rx_${timestamp}@example.com`;
  const patientEmailB = `pat_rx_b_${timestamp}@example.com`;
  const doctorEmail = `doc_rx_${timestamp}@example.com`;
  const adminEmail = `admin_rx_${timestamp}@example.com`;
  const password = 'Password123!';

  let patientId, patientIdB, doctorId, adminId;
  let patientToken, patientTokenB, doctorToken, adminToken;
  let createdPrescriptionId;

  const cleanup = async () => {
    try {
      const ids = [patientId, patientIdB, doctorId, adminId].filter(Boolean);
      if (ids.length > 0) {
        await Prescription.destroy({ where: { doctorId: doctorId || 0 }, force: true }).catch(() => {});
        await Notification.destroy({ where: { recipientId: ids }, force: true }).catch(() => {});
        await ActivityLog.destroy({ where: { userId: ids }, force: true }).catch(() => {});
        for (const id of ids) {
          const user = await User.findByPk(id);
          if (user) await user.destroy({ force: true });
        }
      }
    } catch (err) {
      console.warn('[CLEANUP WARNING]', err.message);
    }
  };

  try {
    // -------------------------------------------------------
    // SETUP
    // -------------------------------------------------------
    console.log('[SETUP] Creating test users...');
    const passHash = await hashPassword(password);

    // Register Patient A
    const regPatA = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmail, password, firstName: 'RxPatient', lastName: 'A', gender: 'Male', dateOfBirth: '1990-01-01' })
    });
    patientId = (await regPatA.json()).data.id;

    // Register Patient B (for unauthorized access tests)
    const regPatB = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmailB, password, firstName: 'RxPatient', lastName: 'B', gender: 'Female', dateOfBirth: '1992-05-15' })
    });
    patientIdB = (await regPatB.json()).data.id;

    // Register Doctor
    const regDoc = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmail, password, firstName: 'RxDoctor', lastName: 'Test', licenseNumber: `LIC_RX_${timestamp}` })
    });
    doctorId = (await regDoc.json()).data.id;

    // Create Admin via DB
    const adminUser = await User.create({ email: adminEmail, passwordHash: passHash, role: 'Admin', status: 'Active' });
    adminId = adminUser.id;

    // Verify doctor and activate all
    await User.update({ status: 'Active' }, { where: { id: [patientId, patientIdB, doctorId] } });
    await Doctor.update({ isVerified: true }, { where: { id: doctorId } });

    // Establish clinical relationship (set Patient A's primaryDoctorId = doctorId)
    await Patient.update({ primaryDoctorId: doctorId }, { where: { id: patientId } });

    // Login all users
    const loginUser = async (email) => {
      const res = await fetch(`${BASE_AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return (await res.json()).data.accessToken;
    };

    patientToken = await loginUser(patientEmail);
    patientTokenB = await loginUser(patientEmailB);
    doctorToken = await loginUser(doctorEmail);
    adminToken = await loginUser(adminEmail);

    console.log('✓ Setup complete.\n');

    // -------------------------------------------------------
    // TEST 1: Doctor creates prescription
    // -------------------------------------------------------
    console.log('[TEST 1] Doctor creates prescription...');
    const t1Res = await fetch(`${BASE_API_URL}/prescriptions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        diagnosis: 'Seasonal flu with mild fever',
        notes: 'Rest and hydrate. Avoid cold environments.',
        followUpDate: '2026-08-01',
        items: [
          { medicineName: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', durationDays: 5, instructions: 'After meals' },
          { medicineName: 'Vitamin C', dosage: '1000mg', frequency: 'Once daily', durationDays: 14, instructions: null }
        ]
      })
    });
    const t1Json = await t1Res.json();
    if (t1Res.status !== 201 || !t1Json.success) throw new Error(`Test 1 Failed: ${t1Res.status} - ${t1Json.message}`);
    createdPrescriptionId = t1Json.data.id;
    if (!createdPrescriptionId) throw new Error('Test 1 Failed: No prescription ID in response.');
    console.log(`✓ Test 1 Passed. (Prescription ID: ${createdPrescriptionId} created)`);

    // -------------------------------------------------------
    // TEST 2: Multiple medicines stored correctly in DB
    // -------------------------------------------------------
    console.log('\n[TEST 2] Verify multiple medicines stored in DB...');
    const dbItems = await PrescriptionItem.findAll({ where: { prescriptionId: createdPrescriptionId } });
    if (dbItems.length !== 2) throw new Error(`Test 2 Failed: Expected 2 items, got ${dbItems.length}`);
    const med1 = dbItems.find(i => i.medicationName === 'Paracetamol');
    const med2 = dbItems.find(i => i.medicationName === 'Vitamin C');
    if (!med1) throw new Error('Test 2 Failed: Paracetamol not found in DB');
    if (!med2) throw new Error('Test 2 Failed: Vitamin C not found in DB');
    if (med1.dosage !== '500mg') throw new Error(`Test 2 Failed: Dosage mismatch for Paracetamol (got ${med1.dosage})`);
    if (med1.durationDays !== 5) throw new Error(`Test 2 Failed: DurationDays mismatch (got ${med1.durationDays})`);
    console.log(`✓ Test 2 Passed. (2 medicines stored: ${dbItems.map(i => i.medicationName).join(', ')})`);

    // -------------------------------------------------------
    // TEST 3: Doctor updates prescription (replaces medicines)
    // -------------------------------------------------------
    console.log('\n[TEST 3] Doctor updates prescription and replaces medicines...');
    const t3Res = await fetch(`${BASE_API_URL}/prescriptions/${createdPrescriptionId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diagnosis: 'Seasonal flu - improving',
        notes: 'Recovering well. Continue Vitamin C.',
        items: [
          { medicineName: 'Vitamin C', dosage: '500mg', frequency: 'Twice daily', durationDays: 7, instructions: 'After breakfast' },
          { medicineName: 'Zinc Supplement', dosage: '25mg', frequency: 'Once daily', durationDays: 14, instructions: null },
          { medicineName: 'Nasal Spray', dosage: '2 sprays', frequency: 'As needed', durationDays: 5, instructions: 'Each nostril' }
        ]
      })
    });
    const t3Json = await t3Res.json();
    if (t3Res.status !== 200 || !t3Json.success) throw new Error(`Test 3 Failed: ${t3Res.status} - ${t3Json.message}`);
    if (t3Json.data.medicines.length !== 3) throw new Error(`Test 3 Failed: Expected 3 medicines after update, got ${t3Json.data.medicines.length}`);

    // Verify old items removed
    const dbItemsAfter = await PrescriptionItem.findAll({ where: { prescriptionId: createdPrescriptionId } });
    if (dbItemsAfter.length !== 3) throw new Error(`Test 3 Failed: DB has ${dbItemsAfter.length} items, expected 3`);
    const hasParacetamol = dbItemsAfter.some(i => i.medicationName === 'Paracetamol');
    if (hasParacetamol) throw new Error('Test 3 Failed: Old medicines (Paracetamol) still present after update');
    console.log(`✓ Test 3 Passed. (Medicines replaced: ${dbItemsAfter.map(i => i.medicationName).join(', ')})`);

    // -------------------------------------------------------
    // TEST 4: Patient retrieves own prescriptions
    // -------------------------------------------------------
    console.log('\n[TEST 4] Patient retrieves own prescriptions...');
    const t4Res = await fetch(`${BASE_API_URL}/prescriptions/patient`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    const t4Json = await t4Res.json();
    if (t4Res.status !== 200 || !t4Json.success) throw new Error(`Test 4 Failed: ${t4Res.status} - ${t4Json.message}`);
    if (!Array.isArray(t4Json.data)) throw new Error('Test 4 Failed: Expected array in data');
    if (t4Json.data.length === 0) throw new Error('Test 4 Failed: No prescriptions returned for patient');
    const rxInList = t4Json.data.find(p => p.id === createdPrescriptionId);
    if (!rxInList) throw new Error(`Test 4 Failed: Created prescription ${createdPrescriptionId} not in patient list`);
    console.log(`✓ Test 4 Passed. (Patient sees ${t4Json.data.length} prescription(s))`);

    // -------------------------------------------------------
    // TEST 5: Patient B cannot access Patient A's prescription
    // -------------------------------------------------------
    console.log('\n[TEST 5] Patient B cannot access Patient A\'s prescription...');
    const t5Res = await fetch(`${BASE_API_URL}/prescriptions/${createdPrescriptionId}`, {
      headers: { 'Authorization': `Bearer ${patientTokenB}` }
    });
    if (t5Res.status !== 403) throw new Error(`Test 5 Failed: Expected 403, got ${t5Res.status}`);
    console.log(`✓ Test 5 Passed. (403 Forbidden for cross-patient access)`);

    // -------------------------------------------------------
    // TEST 6: Doctor cannot prescribe for an unrelated patient
    // -------------------------------------------------------
    console.log('\n[TEST 6] Doctor cannot prescribe for unrelated patient...');
    const t6Res = await fetch(`${BASE_API_URL}/prescriptions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: patientIdB,  // Patient B has no relationship with the doctor
        diagnosis: 'Unauthorized prescription attempt',
        items: [{ medicineName: 'TestMed', dosage: '10mg', frequency: 'Daily', durationDays: 1 }]
      })
    });
    if (t6Res.status !== 403) throw new Error(`Test 6 Failed: Expected 403, got ${t6Res.status}`);
    console.log(`✓ Test 6 Passed. (403 returned for unrelated patient prescription attempt)`);

    // -------------------------------------------------------
    // TEST 7: Admin retrieves prescription
    // -------------------------------------------------------
    console.log('\n[TEST 7] Admin retrieves prescription by ID...');
    const t7Res = await fetch(`${BASE_API_URL}/prescriptions/${createdPrescriptionId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const t7Json = await t7Res.json();
    if (t7Res.status !== 200 || !t7Json.success) throw new Error(`Test 7 Failed: ${t7Res.status} - ${t7Json.message}`);
    if (t7Json.data.id !== createdPrescriptionId) throw new Error(`Test 7 Failed: Wrong prescription returned (got ${t7Json.data.id})`);
    console.log(`✓ Test 7 Passed. (Admin retrieved prescription ID ${t7Json.data.id})`);

    // -------------------------------------------------------
    // TEST 8: Notification created on prescription creation
    // -------------------------------------------------------
    console.log('\n[TEST 8] Prescription creation auto-creates patient notification...');
    // Give async notification a moment to persist
    await new Promise(r => setTimeout(r, 500));
    const notif = await Notification.findOne({
      where: { recipientId: patientId, notificationType: 'Prescription' }
    });
    if (!notif) throw new Error('Test 8 Failed: No Prescription notification found for patient');
    if (!notif.payload || !notif.payload.prescriptionId) throw new Error('Test 8 Failed: Notification payload missing prescriptionId');
    if (notif.payload.prescriptionId !== createdPrescriptionId) throw new Error(`Test 8 Failed: Notification payload has wrong prescriptionId (${notif.payload.prescriptionId})`);
    console.log(`✓ Test 8 Passed. (Notification created: "${notif.title}" with payload: ${JSON.stringify(notif.payload)})`);

    // -------------------------------------------------------
    // TEST 9: Activity logs created for PRESCRIPTION_CREATED and PRESCRIPTION_UPDATED
    // -------------------------------------------------------
    console.log('\n[TEST 9] Verify PRESCRIPTION_CREATED and PRESCRIPTION_UPDATED activity logs...');
    const createdLog = await ActivityLog.findOne({
      where: { userId: doctorId, action: 'PRESCRIPTION_CREATED', entityId: createdPrescriptionId }
    });
    if (!createdLog) throw new Error('Test 9 Failed: PRESCRIPTION_CREATED activity log not found');

    const updatedLog = await ActivityLog.findOne({
      where: { userId: doctorId, action: 'PRESCRIPTION_UPDATED', entityId: createdPrescriptionId }
    });
    if (!updatedLog) throw new Error('Test 9 Failed: PRESCRIPTION_UPDATED activity log not found');
    console.log(`✓ Test 9 Passed. (Both PRESCRIPTION_CREATED and PRESCRIPTION_UPDATED logs present)`);

    // -------------------------------------------------------
    // TEST 10: Transaction rollback — no partial writes
    // -------------------------------------------------------
    console.log('\n[TEST 10] Transaction rollback — no partial prescription created...');
    const rxCountBefore = await Prescription.count({ where: { doctorId } });
    const itemCountBefore = await PrescriptionItem.count();

    try {
      const t = await sequelize.transaction();
      const rx = await Prescription.create({
        doctorId, patientId, diagnosis: 'Rollback Test', status: 'Active'
      }, { transaction: t });
      await PrescriptionItem.create({
        prescriptionId: rx.id, medicationName: 'RollbackMed', dosage: '10mg', frequency: 'Daily', durationDays: 1
      }, { transaction: t });
      await t.rollback();
    } catch (_) {}

    const rxCountAfter = await Prescription.count({ where: { doctorId } });
    const itemCountAfter = await PrescriptionItem.count();
    if (rxCountAfter !== rxCountBefore) throw new Error(`Test 10 Failed: Prescription count changed (${rxCountBefore}→${rxCountAfter})`);
    if (itemCountAfter !== itemCountBefore) throw new Error(`Test 10 Failed: PrescriptionItem count changed (${itemCountBefore}→${itemCountAfter})`);
    console.log(`✓ Test 10 Passed. (Transaction rollback preserved state: ${rxCountBefore} prescriptions)`);

    // -------------------------------------------------------
    // TEST 11: DTO Sanitization
    // -------------------------------------------------------
    console.log('\n[TEST 11] DTO sanitization — no sensitive fields exposed...');
    const t11Res = await fetch(`${BASE_API_URL}/prescriptions/${createdPrescriptionId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const t11Json = await t11Res.json();
    if (t11Res.status !== 200) throw new Error('Test 11 Failed: Could not retrieve prescription');
    const dto = t11Json.data;

    const forbidden = ['passwordHash', 'deletedAt', 'password_hash', 'deleted_at'];
    const checkObject = (obj, path = '') => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        if (forbidden.includes(key)) throw new Error(`Test 11 Failed: Forbidden field "${path}${key}" exposed in DTO`);
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          checkObject(obj[key], `${path}${key}.`);
        }
      }
    };
    checkObject(dto);

    const required = ['id', 'diagnosis', 'notes', 'status', 'prescribedAt', 'doctor', 'patient', 'medicines'];
    for (const field of required) {
      if (!dto.hasOwnProperty(field)) throw new Error(`Test 11 Failed: DTO missing required field "${field}"`);
    }
    if (!Array.isArray(dto.medicines) || dto.medicines.length === 0) throw new Error('Test 11 Failed: medicines array is empty or missing');
    const medDto = dto.medicines[0];
    const medRequired = ['id', 'medicineName', 'dosage', 'frequency', 'durationDays'];
    for (const field of medRequired) {
      if (!medDto.hasOwnProperty(field)) throw new Error(`Test 11 Failed: Medicine DTO missing field "${field}"`);
    }
    if (medDto.hasOwnProperty('prescriptionId')) throw new Error('Test 11 Failed: Medicine DTO exposes prescriptionId (internal field)');
    if (medDto.hasOwnProperty('medicationName')) throw new Error('Test 11 Failed: Medicine DTO exposes raw "medicationName" (should be "medicineName")');
    console.log(`✓ Test 11 Passed. (DTO fields: [${Object.keys(dto).join(', ')}])`);

    // -------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------
    console.log('\n\n=== ✅ ALL 11 PRESCRIPTION TESTS PASSED ===\n');

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error.message);
    process.exitCode = 1;
  } finally {
    await cleanup();
    console.log('[CLEANUP] Test data removed.');
    await sequelize.close();
  }
}

runTests();
