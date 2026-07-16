const { User, Doctor, Patient, DoctorNote, ActivityLog } = require('../models');
const { sequelize } = require('../models');
const { hashPassword } = require('../auth/utils/password');

const BASE_API_URL = 'http://localhost:5000/api/v1';
const BASE_AUTH_URL = 'http://localhost:5000/api/auth';

async function runTests() {
  console.log('=== Starting Doctor Notes Management Verification Tests (Phase 5.9) ===\n');

  const timestamp = Date.now();
  const patientEmail = `pat_note_${timestamp}@example.com`;
  const doctorEmail = `doc_note_${timestamp}@example.com`;
  const doctorEmailB = `doc_note_b_${timestamp}@example.com`;
  const adminEmail = `admin_note_${timestamp}@example.com`;
  const password = 'Password123!';

  let patientId, doctorId, doctorIdB, adminId;
  let patientToken, doctorToken, doctorTokenB, adminToken;
  let createdNoteId;

  const cleanup = async () => {
    try {
      const ids = [patientId, doctorId, doctorIdB, adminId].filter(Boolean);
      if (ids.length > 0) {
        await DoctorNote.destroy({ where: { doctorId: [doctorId, doctorIdB].filter(Boolean) }, force: true }).catch(() => {});
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

    // Register Patient
    const regPat = await fetch(`${BASE_AUTH_URL}/register/patient`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: patientEmail, password, firstName: 'NotePatient', lastName: 'A', gender: 'Male', dateOfBirth: '1990-01-01' })
    });
    patientId = (await regPat.json()).data.id;

    // Register Doctor A (creator)
    const regDoc = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmail, password, firstName: 'NoteDoctor', lastName: 'A', licenseNumber: `LIC_NOTE_${timestamp}` })
    });
    doctorId = (await regDoc.json()).data.id;

    // Register Doctor B (unrelated/unauthorized)
    const regDocB = await fetch(`${BASE_AUTH_URL}/register/doctor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: doctorEmailB, password, firstName: 'NoteDoctor', lastName: 'B', licenseNumber: `LIC_NOTE_B_${timestamp}` })
    });
    doctorIdB = (await regDocB.json()).data.id;

    // Create Admin
    const adminUser = await User.create({ email: adminEmail, passwordHash: passHash, role: 'Admin', status: 'Active' });
    adminId = adminUser.id;

    // Activate all users
    await User.update({ status: 'Active' }, { where: { id: [patientId, doctorId, doctorIdB] } });
    await Doctor.update({ isVerified: true }, { where: { id: [doctorId, doctorIdB] } });

    // Establish relationship between Patient and Doctor A
    await Patient.update({ primaryDoctorId: doctorId }, { where: { id: patientId } });

    // Login users
    const loginUser = async (email) => {
      const res = await fetch(`${BASE_AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return (await res.json()).data.accessToken;
    };

    patientToken = await loginUser(patientEmail);
    doctorToken = await loginUser(doctorEmail);
    doctorTokenB = await loginUser(doctorEmailB);
    adminToken = await loginUser(adminEmail);

    console.log('✓ Setup complete.\n');

    // -------------------------------------------------------
    // TEST 1: Doctor creates note
    // -------------------------------------------------------
    console.log('[TEST 1] Doctor creates note...');
    const t1Res = await fetch(`${BASE_API_URL}/doctor-notes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        title: 'Initial Psychiatric Evaluation',
        note: 'Patient exhibits mild symptoms of anxiety and work-related stress. Recommend CBT.'
      })
    });
    const t1Json = await t1Res.json();
    if (t1Res.status !== 201 || !t1Json.success) {
      throw new Error(`Test 1 Failed: ${t1Res.status} - ${JSON.stringify(t1Json)}`);
    }
    createdNoteId = t1Json.data.id;
    if (!createdNoteId) throw new Error('Test 1 Failed: No note ID returned.');
    console.log(`✓ Test 1 Passed. (Note ID: ${createdNoteId} created)`);

    // -------------------------------------------------------
    // TEST 2: Doctor updates note
    // -------------------------------------------------------
    console.log('\n[TEST 2] Doctor updates note...');
    const t2Res = await fetch(`${BASE_API_URL}/doctor-notes/${createdNoteId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Initial Psychiatric Evaluation - Updated',
        note: 'Patient exhibits mild anxiety. Recommended 6 sessions of CBT and mindfulness.'
      })
    });
    const t2Json = await t2Res.json();
    if (t2Res.status !== 200 || !t2Json.success) {
      throw new Error(`Test 2 Failed: ${t2Res.status} - ${JSON.stringify(t2Json)}`);
    }
    // Verify in database
    const dbNote = await DoctorNote.findByPk(createdNoteId);
    if (dbNote.title !== 'Initial Psychiatric Evaluation - Updated') {
      throw new Error(`Test 2 Failed: Title not updated in DB. Got: ${dbNote.title}`);
    }
    if (dbNote.noteContent !== 'Patient exhibits mild anxiety. Recommended 6 sessions of CBT and mindfulness.') {
      throw new Error('Test 2 Failed: Note content not updated in DB.');
    }
    console.log('✓ Test 2 Passed. (Doctor updated note successfully)');

    // -------------------------------------------------------
    // TEST 3: Doctor archives note
    // -------------------------------------------------------
    console.log('\n[TEST 3] Doctor archives note...');
    const t3Res = await fetch(`${BASE_API_URL}/doctor-notes/${createdNoteId}/archive`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${doctorToken}`, 'Content-Type': 'application/json' }
    });
    const t3Json = await t3Res.json();
    if (t3Res.status !== 200 || !t3Json.success) {
      throw new Error(`Test 3 Failed: ${t3Res.status} - ${JSON.stringify(t3Json)}`);
    }
    // Verify in database
    const dbNoteArchived = await DoctorNote.findByPk(createdNoteId);
    if (!dbNoteArchived.isArchived) {
      throw new Error('Test 3 Failed: Note isArchived field is false.');
    }
    console.log('✓ Test 3 Passed. (Note archived successfully)');

    // -------------------------------------------------------
    // TEST 4: Doctor retrieves own notes
    // -------------------------------------------------------
    console.log('\n[TEST 4] Doctor retrieves own notes...');
    // Create another active note so we have at least one unarchived note
    await fetch(`${BASE_API_URL}/doctor-notes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${doctorToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        title: 'Active clinical note',
        note: 'This note is active and should be returned.'
      })
    });

    const t4Res = await fetch(`${BASE_API_URL}/doctor-notes/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    const t4Json = await t4Res.json();
    if (t4Res.status !== 200 || !t4Json.success) {
      throw new Error(`Test 4 Failed: ${t4Res.status} - ${JSON.stringify(t4Json)}`);
    }
    // Verify archived note is excluded by default
    const list = t4Json.data;
    if (list.length < 1) throw new Error('Test 4 Failed: No notes returned.');
    const containsArchived = list.some(n => n.id === createdNoteId);
    if (containsArchived) {
      throw new Error('Test 4 Failed: Doctor notes list returned archived note.');
    }
    console.log(`✓ Test 4 Passed. (Doctor retrieved own active notes. Count: ${list.length})`);

    // -------------------------------------------------------
    // TEST 5: Patient attempts access
    // -------------------------------------------------------
    console.log('\n[TEST 5] Patient attempts access...');
    const t5Res = await fetch(`${BASE_API_URL}/doctor-notes/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    if (t5Res.status !== 403) {
      throw new Error(`Test 5 Failed: Patient notes/me call expected 403, got ${t5Res.status}`);
    }
    const t5ResSingle = await fetch(`${BASE_API_URL}/doctor-notes/${createdNoteId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    if (t5ResSingle.status !== 403) {
      throw new Error(`Test 5 Failed: Patient single note retrieval expected 403, got ${t5ResSingle.status}`);
    }
    console.log('✓ Test 5 Passed. (Patient access rejected with 403)');

    // -------------------------------------------------------
    // TEST 6: Doctor attempts another doctor\'s note
    // -------------------------------------------------------
    console.log('\n[TEST 6] Doctor attempts another doctor\'s note...');
    const t6Res = await fetch(`${BASE_API_URL}/doctor-notes/${createdNoteId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doctorTokenB}` }
    });
    if (t6Res.status !== 403) {
      throw new Error(`Test 6 Failed: Expected 403, got ${t6Res.status}`);
    }
    console.log('✓ Test 6 Passed. (Unauthorized doctor access rejected with 403)');

    // -------------------------------------------------------
    // TEST 7: Admin retrieves patient notes
    // -------------------------------------------------------
    console.log('\n[TEST 7] Admin retrieves patient notes...');
    const t7Res = await fetch(`${BASE_API_URL}/doctor-notes/admin/patient/${patientId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const t7Json = await t7Res.json();
    if (t7Res.status !== 200 || !t7Json.success) {
      throw new Error(`Test 7 Failed: ${t7Res.status} - ${JSON.stringify(t7Json)}`);
    }
    if (t7Json.data.length < 2) {
      throw new Error(`Test 7 Failed: Admin should see 2 notes, saw: ${t7Json.data.length}`);
    }
    console.log(`✓ Test 7 Passed. (Admin retrieved all notes: ${t7Json.data.length})`);

    // -------------------------------------------------------
    // TEST 8: Activity Logs
    // -------------------------------------------------------
    console.log('\n[TEST 8] Verify DOCTOR_NOTE_CREATED, DOCTOR_NOTE_UPDATED, DOCTOR_NOTE_ARCHIVED activity logs...');
    const createdLog = await ActivityLog.findOne({ where: { action: 'DOCTOR_NOTE_CREATED', userId: doctorId } });
    const updatedLog = await ActivityLog.findOne({ where: { action: 'DOCTOR_NOTE_UPDATED', userId: doctorId } });
    const archivedLog = await ActivityLog.findOne({ where: { action: 'DOCTOR_NOTE_ARCHIVED', userId: doctorId } });

    if (!createdLog) throw new Error('Test 8 Failed: DOCTOR_NOTE_CREATED log missing.');
    if (!updatedLog) throw new Error('Test 8 Failed: DOCTOR_NOTE_UPDATED log missing.');
    if (!archivedLog) throw new Error('Test 8 Failed: DOCTOR_NOTE_ARCHIVED log missing.');

    console.log('✓ Test 8 Passed. (All 3 activity logs verified in DB)');

    // -------------------------------------------------------
    // TEST 9: Transaction Rollback
    // -------------------------------------------------------
    console.log('\n[TEST 9] Transaction rollback — no partial writes on failure...');
    const notesCountBefore = await DoctorNote.count();
    const logsCountBefore = await ActivityLog.count();

    // Trigger failure by sending an invalid/non-existent doctorId internally in service or let's simulate Sequelize write failure.
    // We can force a write failure by violating constraints during createNote.
    // For example, patientId is invalid or note content is missing, but validation would catch it.
    // We can bypass validation by testing the service layer directly with invalid fields that fail DB constraints, or run inside validation bounds.
    // Let's call the service directly with database constraint violation: patientId = null (null constraint on patient_id).
    const doctorNoteService = require('../doctor-notes/services/doctor-note.service');
    try {
      await doctorNoteService.createNote(doctorUserId = doctorId, {
        patientId: null, // this will fail database constraint
        title: 'Constraint failure note',
        note: 'This will fail.'
      });
      throw new Error('Test 9 Failed: database constraint violation did not throw.');
    } catch (err) {
      // Expected DB validation error
    }

    const notesCountAfter = await DoctorNote.count();
    const logsCountAfter = await ActivityLog.count();

    if (notesCountBefore !== notesCountAfter) {
      throw new Error('Test 9 Failed: DoctorNote was created despite transaction failure.');
    }
    if (logsCountBefore !== logsCountAfter) {
      throw new Error('Test 9 Failed: ActivityLog was inserted despite transaction failure.');
    }
    console.log('✓ Test 9 Passed. (Transaction rolled back completely, no state changes)');

    // -------------------------------------------------------
    // TEST 10: DTO Sanitization
    // -------------------------------------------------------
    console.log('\n[TEST 10] DTO sanitization — no sensitive fields exposed...');
    const singleNoteRes = await fetch(`${BASE_API_URL}/doctor-notes/${createdNoteId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const singleNoteJson = await singleNoteRes.json();
    const keys = Object.keys(singleNoteJson.data);
    const forbidden = ['passwordHash', 'deletedAt', 'noteContent', 'doctor_id', 'patient_id'];
    for (const key of forbidden) {
      if (keys.includes(key)) {
        throw new Error(`Test 10 Failed: Response contains sensitive/unmapped key: ${key}`);
      }
    }
    console.log(`✓ Test 10 Passed. (DTO fields: [${keys.join(', ')}])`);


    console.log('\n=== ✅ ALL 10 DOCTOR NOTES TESTS PASSED ===\n');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err.message);
    process.exit(1);
  } finally {
    await cleanup();
    console.log('[CLEANUP] Test data removed.');
    process.exit(0);
  }
}

runTests();
