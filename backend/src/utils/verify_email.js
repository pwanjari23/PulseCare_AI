/**
 * PulseCare AI – Phase 6.2 Verification Tests
 * Email Service Module
 *
 * Run: node src/utils/verify_email.js
 */

const emailService = require('../email/config/email');
const SmtpProvider = require('../email/providers/smtp.provider');
const EmailProviderInterface = require('../email/providers/email.interface');
const { ApiError } = require('#utils/apiResponse.js');
const { EMAIL_TYPES } = require('../email/constants/email.constants');

const welcomeTemplate = require('../email/templates/welcome.template');
const doctorRegistrationTemplate = require('../email/templates/doctor-registration.template');
const doctorApprovedTemplate = require('../email/templates/doctor-approved.template');
const doctorRejectedTemplate = require('../email/templates/doctor-rejected.template');
const appointmentBookedTemplate = require('../email/templates/appointment-booked.template');
const appointmentCancelledTemplate = require('../email/templates/appointment-cancelled.template');
const appointmentCompletedTemplate = require('../email/templates/appointment-completed.template');
const prescriptionIssuedTemplate = require('../email/templates/prescription-issued.template');
const vitalAlertTemplate = require('../email/templates/vital-alert.template');
const passwordResetTemplate = require('../email/templates/password-reset.template');
const verifyEmailTemplate = require('../email/templates/verify-email.template');
const systemTemplate = require('../email/templates/system.template');

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

async function runTests() {
  console.log('=== Phase 6.2 – Email Service Module Verification Tests ===\n');

  try {
    const testEmail = 'patient_test@example.com';
    const docEmail = 'doctor_test@example.com';

    // ── Test 1: Welcome Email ────────────────────────────────────────────────
    console.log('Test 1: Welcome Email');
    const t1 = await emailService.sendWelcomeEmail(testEmail, { firstName: 'Alice' });
    assert(t1.success === true, 'Welcome email sent successfully');

    // ── Test 2: Doctor Approval Email ────────────────────────────────────────
    console.log('\nTest 2: Doctor Approval Email');
    const t2 = await emailService.sendDoctorApprovalEmail(docEmail, { firstName: 'Bob' });
    assert(t2.success === true, 'Doctor approval email sent successfully');

    // ── Test 3: Appointment Booked Email ──────────────────────────────────────
    console.log('\nTest 3: Appointment Booked Email');
    const t3 = await emailService.sendAppointmentBookedEmail(testEmail, {
      recipientName: 'Alice',
      otherPartyName: 'Dr. Bob',
      dateTime: new Date().toLocaleString(),
      reason: 'General Checkup',
    });
    assert(t3.success === true, 'Appointment booked email sent successfully');

    // ── Test 4: Vital Alert Email ───────────────────────────────────────────
    console.log('\nTest 4: Vital Alert Email');
    const t4 = await emailService.sendVitalAlertEmail(testEmail, {
      patientName: 'Alice',
      vitals: {
        heartRate: 110,
        spo2: 92,
        temperature: 98.6,
        systolicBp: 140,
        diastolicBp: 90,
      },
    });
    assert(t4.success === true, 'Vital alert email sent successfully');

    // ── Test 5: Prescription Email ───────────────────────────────────────────
    console.log('\nTest 5: Prescription Email');
    const t5 = await emailService.sendPrescriptionEmail(testEmail, {
      patientName: 'Alice',
      doctorName: 'Dr. Bob',
      prescriptionId: 101,
      diagnosis: 'Hypertension',
      items: [
        { medicationName: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', durationDays: 30 },
      ],
    });
    assert(t5.success === true, 'Prescription email sent successfully');

    // ── Test 6: Invalid Email Address ────────────────────────────────────────
    console.log('\nTest 6: Invalid Email Address (graceful failure, log error)');
    // Pass an invalid object or malformed address that fails downstream SMTP validate check
    // Our service catches errors for informational emails and returns success: false
    const t6 = await emailService.sendWelcomeEmail(null, { firstName: 'Alice' });
    assert(t6.success === false, 'Invalid email is gracefully handled, returns success: false');

    // ── Test 7: SMTP Unavailable (Informational flow continues) ─────────────
    console.log('\nTest 7: SMTP Unavailable - Informational (API does not crash)');
    // Temporarily configure transport to throw to simulate server down
    const originalSend = emailService.provider.send;
    emailService.provider.send = async () => {
      throw new Error('SMTP connection timed out');
    };

    const t7 = await emailService.sendWelcomeEmail(testEmail, { firstName: 'Alice' });
    assert(t7.success === false, 'SMTP timeout does not throw error for welcome email');
    assert(t7.error === 'SMTP connection timed out', 'Error message matches timeout message');

    // ── Test 8: SMTP Unavailable (Password Reset mandatory flow throws ApiError) ─
    console.log('\nTest 8: SMTP Unavailable - Password Reset (Throws ApiError)');
    let apiErrorThrown = false;
    try {
      await emailService.sendPasswordResetEmail(testEmail, { firstName: 'Alice', resetUrl: 'http://localhost/reset' });
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 500) {
        apiErrorThrown = true;
      }
    }
    assert(apiErrorThrown, 'SMTP failure on password reset email throws a 500 ApiError');

    // Restore provider send function
    emailService.provider.send = originalSend;

    // ── Test 9: HTML Template Rendering (Verify placeholders) ───────────────
    console.log('\nTest 9: HTML Template Rendering');
    const welcomeHtml = welcomeTemplate({ firstName: 'Alice' });
    const registrationHtml = doctorRegistrationTemplate({ firstName: 'Bob' });
    const approvedHtml = doctorApprovedTemplate({ firstName: 'Bob' });
    const rejectedHtml = doctorRejectedTemplate({ firstName: 'Bob', reason: 'License expired' });
    const bookedHtml = appointmentBookedTemplate({ recipientName: 'Alice', otherPartyName: 'Dr. Bob', dateTime: 'Tomorrow', reason: 'Checkup' });
    const cancelledHtml = appointmentCancelledTemplate({ recipientName: 'Alice', otherPartyName: 'Dr. Bob', dateTime: 'Tomorrow', cancelledBy: 'Patient' });
    const completedHtml = appointmentCompletedTemplate({ recipientName: 'Alice', otherPartyName: 'Dr. Bob', dateTime: 'Yesterday' });
    const prescriptionHtml = prescriptionIssuedTemplate({ patientName: 'Alice', doctorName: 'Dr. Bob', items: [{ medicationName: 'MedA' }] });
    const alertHtml = vitalAlertTemplate({ patientName: 'Alice', vitals: { heartRate: 120 } });
    const resetHtml = passwordResetTemplate({ firstName: 'Alice', resetUrl: 'http://reset' });
    const verifyHtml = verifyEmailTemplate({ firstName: 'Alice', verifyUrl: 'http://verify' });
    const systemHtml = systemTemplate({ recipientName: 'Alice', title: 'System Notification', message: 'Core notification' });

    assert(welcomeHtml.includes('Alice') && welcomeHtml.includes('PulseCare'), 'Welcome Template renders firstName');
    assert(registrationHtml.includes('Dr. Bob') && registrationHtml.includes('PulseCare'), 'Doctor Registration Template renders firstName');
    assert(approvedHtml.includes('Dr. Bob'), 'Approved Template renders firstName');
    assert(rejectedHtml.includes('Dr. Bob') && rejectedHtml.includes('License expired'), 'Rejected Template renders firstName and reason');
    assert(bookedHtml.includes('Alice') && bookedHtml.includes('Dr. Bob') && bookedHtml.includes('Checkup'), 'Booked Template renders names and reason');
    assert(cancelledHtml.includes('Alice') && cancelledHtml.includes('Dr. Bob') && cancelledHtml.includes('Patient'), 'Cancelled Template renders names and canceller');
    assert(completedHtml.includes('Alice') && completedHtml.includes('Dr. Bob'), 'Completed Template renders names');
    assert(prescriptionHtml.includes('Alice') && prescriptionHtml.includes('Dr. Bob') && prescriptionHtml.includes('MedA'), 'Prescription Template renders names and items');
    assert(alertHtml.includes('Alice') && alertHtml.includes('120 bpm'), 'Alert Template renders patientName and vitals values');
    assert(resetHtml.includes('Alice') && resetHtml.includes('http://reset'), 'Reset Template renders name and resetUrl');
    assert(verifyHtml.includes('Alice') && verifyHtml.includes('http://verify'), 'Verify Template renders name and verifyUrl');
    assert(systemHtml.includes('Alice') && systemHtml.includes('Core notification'), 'System Template renders message');

    // ── Test 10: Provider Abstraction (Swappable Provider Mocking) ─────────────
    console.log('\nTest 10: Provider Abstraction');
    let mockSendCount = 0;
    let mockLastSendOptions = null;

    class MockEmailProvider extends EmailProviderInterface {
      async send(options) {
        mockSendCount++;
        mockLastSendOptions = options;
        return { messageId: 'mock-123' };
      }
    }

    const mockProvider = new MockEmailProvider();
    // Instantiate new EmailService with mock provider to verify it operates independently
    const testEmailService = new (require('../email/services/email.service'))(mockProvider);

    await testEmailService.sendWelcomeEmail('alice@mock.com', { firstName: 'Alice' });
    assert(mockSendCount === 1, 'Mock provider called once');
    assert(mockLastSendOptions.to === 'alice@mock.com', 'Recipient forwarded to mock provider');
    assert(mockLastSendOptions.subject.includes('Welcome'), 'Subject correctly populated');

  } catch (err) {
    console.error('\n🚨 Unexpected test error:', err.message, err.stack);
    failed++;
  } finally {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    if (failed === 0) {
      console.log('🎉 All Phase 6.2 Email Service tests PASSED!');
    } else {
      console.log('⚠️  Some tests failed. Review output above.');
      process.exit(1);
    }
  }
}

runTests();
