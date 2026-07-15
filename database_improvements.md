# Database Schema Enhancements: PulseCare AI

This blueprint details production-grade enhancements to the **PulseCare AI** database architecture. It implements clinical variables, audit tracking, cache layers, validation constraints, and indexing rules while preserving existing tables.

---

## 1. Domain Field Enhancements

### A. Doctors Table Extensions
Adding fields to support profiles, clinic reviews, and compliance records:
*   `profile_photo_url` (`VARCHAR(255)`, Nullable): Path to S3/Cloud Storage object storing profile photo.
*   `experience_years` (`TINYINT UNSIGNED`, Nullable): Direct experience count for clinical credibility.
*   `rating_avg` (`DECIMAL(3, 2)`, Default: `0.00`): Caches review score averages, preventing costly real-time aggregation queries.
*   `reviews_count` (`INT UNSIGNED`, Default: `0`): Denormalized review count to support sorting algorithms.
*   `bio` (`TEXT`, Nullable): Clinical details and credentials summary.
*   `consultation_fee` (`DECIMAL(10, 2)`, Default: `0.00`): Fee structure for clinic scheduling.
*   `languages` (`VARCHAR(255)`, Nullable): Comma-separated languages list (e.g., `"English, Spanish"`). Keeps the schema simple for initial development.
*   `is_verified` (`BOOLEAN`, Default: `FALSE`): Compliance flag set by admin to verify licensing.
*   `created_by_admin_id` (`BIGINT UNSIGNED`, Nullable, FK to `users.id`): Audit link tracking which admin initialized the credential.
*   `last_active_at` (`TIMESTAMP`, Nullable): Tracks active sessions.

### B. Patients Table Extensions
Adding fields for emergency contexts, lifestyles, and profile completeness:
*   `profile_photo_url` (`VARCHAR(255)`, Nullable): Path to patient profile photo.
*   `height_cm` (`DECIMAL(5, 2)`, Nullable): Required to calculate Body Mass Index (BMI).
*   `emergency_contact_name` (`VARCHAR(100)`, Nullable): Emergency contact first and last name.
*   `emergency_contact_phone` (`VARCHAR(20)`, Nullable): Direct phone number for emergency contact.
*   `emergency_contact_relation` (`VARCHAR(50)`, Nullable): Relationship identifier (e.g., `'Spouse'`, `'Parent'`).
*   `medical_conditions` (`TEXT`, Nullable): Common pre-existing conditions (e.g., `'Hypertension, Type II Diabetes'`).
*   `allergies` (`TEXT`, Nullable): Patient allergies.
*   `smoking_status` (`ENUM('Non-smoker', 'Former smoker', 'Active smoker')`, Nullable): Health risk indicator.
*   `alcohol_consumption` (`ENUM('None', 'Occasional', 'Regular', 'Heavy')`, Nullable): Health risk indicator.
*   `last_vital_submitted_at` (`TIMESTAMP`, Nullable): Timestamp of the last vital log submission. Used to detect inactive patients.
*   `profile_completion_pct` (`TINYINT UNSIGNED`, Default: `0`): Tracks patient profile completion percentage.

### C. Vitals Logs Extensions
Adding diagnostic variables and telemetry source tracking:
*   `respiratory_rate` (`SMALLINT UNSIGNED`, Nullable): Breaths per minute (rpm) to monitor pulmonary health.
*   `blood_glucose_mgdl` (`DECIMAL(5, 2)`, Nullable): Blood sugar readings for diabetic monitoring.
*   `blood_glucose_type` (`ENUM('Fasting', 'Random', 'Post-Meal')`, Nullable): Ingested context of glucose reading.
*   `pain_level` (`TINYINT UNSIGNED`, Nullable): Subjective pain scale rating (1-10).
*   `sleep_hours` (`DECIMAL(4, 2)`, Nullable): Sleep duration logging.
*   `symptoms` (`TEXT`, Nullable): Comma-separated patient symptoms.
*   `mood` (`VARCHAR(50)`, Nullable): Subjective mood logging.
*   `notes` (`TEXT`, Nullable): General patient logs notes.
*   `source` (`ENUM('Manual', 'Bluetooth', 'Wearable', 'Imported')`, Default: `'Manual'`): Identifies the source of telemetry ingestion (e.g., Apple Watch, manual entry).

### D. Appointments Extensions
Adding virtual clinic tools and cancellation tracking:
*   `appointment_type` (`ENUM('Online', 'Offline')`, Default: `'Online'`): Indicates if the consultation is virtual or in-person.
*   `meeting_link` (`VARCHAR(255)`, Nullable): Jitsi/Zoom video room link.
*   `cancellation_reason` (`VARCHAR(255)`, Nullable): Reason for appointment cancellation.
*   `rescheduled_from_id` (`BIGINT UNSIGNED`, Nullable, FK to `appointments.id`): Self-referential FK tracking rescheduling history.
*   `duration_minutes` (`SMALLINT UNSIGNED`, Default: `30`): Consultation duration.

### E. Prescriptions Extensions
Adding fields to track prescription status and clinical context:
*   `diagnosis` (`VARCHAR(255)`, Nullable): ICD-10 clinical code or description indicating why the medication was prescribed.
*   `follow_up_date` (`DATE`, Nullable): Recommended date for patient follow-up.
*   `status` (`ENUM('Active', 'Expired', 'Discontinued')`, Default: `'Active'`): Tracks the current status of the prescription.

---

## 2. New Normalized Entities

### A. Lookup Table: `specializations`
Instead of using free text in the `doctors` table, a normalization table ensures consistent categories:
```sql
CREATE TABLE specializations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### B. Table: `notifications`
Supports multi-device alert tracking and notification history:
```sql
CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  recipient_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('VitalAlert', 'PrescriptionIssued', 'AppointmentScheduled', 'RequestReceived', 'System') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_entity VARCHAR(50) NULL, -- E.g., 'prescriptions', 'vitals_alerts'
  related_entity_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### C. Table: `activity_logs`
Provides a HIPAA-compliant audit trail of all system activities:
```sql
CREATE TABLE activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL, -- Nullable for anonymous access (e.g., failed logins)
  action VARCHAR(100) NOT NULL, -- E.g. 'LOGIN_SUCCESS', 'UPDATE_VITALS'
  module VARCHAR(50) NOT NULL, -- E.g. 'AUTH', 'TELEMETRY'
  entity VARCHAR(50) NULL, -- E.g. 'vitals_logs'
  entity_id BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NOT NULL, -- Supports IPv4 and IPv6
  user_agent VARCHAR(255) NOT NULL, -- Browser and OS details
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### D. Table: `doctor_notes`
Allows doctors to record private clinical notes regarding a patient that are not visible to the patient (crucial for HIPAA subjective records segregation):
```sql
CREATE TABLE doctor_notes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id BIGINT UNSIGNED NOT NULL,
  doctor_id BIGINT UNSIGNED NOT NULL,
  note_content TEXT NOT NULL, -- Encrypted at rest
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

### E. Table: `patient_health_summaries`
A cache layer that stores pre-calculated health scores and risk levels, preventing expensive real-time calculations:
```sql
CREATE TABLE patient_health_summaries (
  patient_id BIGINT UNSIGNED PRIMARY KEY,
  health_score TINYINT UNSIGNED DEFAULT 100, -- Dynamic rating (0-100)
  risk_level ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Low',
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
```

---

## 3. Database Constraints & Cascades

### A. Check Constraints (SQL level validation)
*   **`vitals_logs.pain_level`**: `CHECK (pain_level BETWEEN 1 AND 10)`
*   **`vitals_logs.oxygen_level`**: `CHECK (oxygen_level BETWEEN 0 AND 100)`
*   **`patient_health_summaries.health_score`**: `CHECK (health_score BETWEEN 0 AND 100)`

### B. Cascades & Referrals Logic
*   `Cascade Delete`: Applied to dependent tables like `vitals_logs`, `doctor_notes`, `patient_health_summaries`, and `notifications`. When a user account is deleted, their associated logs are automatically cleared.
*   `Restrict Delete`: Applied to legal records like `prescriptions` and `appointments`. A doctor cannot be deleted from the database if they have active prescription records, maintaining medical compliance.

---

## 4. Recommended Indexes

1.  **`activity_logs` Index**: `(user_id, created_at DESC)`
    *   *Why*: Required for auditing and security monitors.
2.  **`notifications` Index**: `(recipient_id, is_read)`
    *   *Why*: Speeds up fetching unread notification badges in the UI.
3.  **`patients` Index**: `(zip_code, primary_doctor_id)`
    *   *Why*: Speeds up loading list panels.
4.  **`vitals_logs` Index**: `(patient_id, source)`
    *   *Why*: Fast analysis filtering (e.g. comparing manual versus wearable logs).
