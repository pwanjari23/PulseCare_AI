'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const doctors = [
      {
        id: 2,
        first_name: 'Sarah',
        last_name: 'Conner',
        license_number: 'MD-100234',
        specialization_id: 1, // Cardiologist
        clinic_name: 'CardioCare Medical Group',
        clinic_address: '100 Medical Plaza, Suite 400, Los Angeles',
        clinic_zip: '90024',
        experience_years: 14,
        profile_photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.85,
        reviews_count: 42,
        consultation_fee: 150.00,
        languages: 'English, Spanish',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        first_name: 'David',
        last_name: 'Miller',
        license_number: 'MD-100235',
        specialization_id: 2, // General Physician
        clinic_name: 'Miller Family Practice',
        clinic_address: '250 Oak Ave, Suite A, Chicago',
        clinic_zip: '60601',
        experience_years: 8,
        profile_photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.90,
        reviews_count: 28,
        consultation_fee: 90.00,
        languages: 'English',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        first_name: 'Robert',
        last_name: 'Chen',
        license_number: 'MD-100236',
        specialization_id: 3, // Diabetologist
        clinic_name: 'Endocrinology & Diabetes Clinic',
        clinic_address: '750 Metro Blvd, Suite 210, San Francisco',
        clinic_zip: '94103',
        experience_years: 12,
        profile_photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.70,
        reviews_count: 19,
        consultation_fee: 175.00,
        languages: 'English, Mandarin',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        first_name: 'Elena',
        last_name: 'Rostova',
        license_number: 'MD-100237',
        specialization_id: 4, // Neurologist
        clinic_name: 'Neuroscience Center of Excellence',
        clinic_address: '400 Brain Dr, Suite 500, Boston',
        clinic_zip: '02115',
        experience_years: 18,
        profile_photo_url: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.95,
        reviews_count: 55,
        consultation_fee: 220.00,
        languages: 'English, Russian',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        first_name: 'Marcus',
        last_name: 'Vance',
        license_number: 'MD-100238',
        specialization_id: 5, // Orthopedic
        clinic_name: 'Joint & Bone Surgeons',
        clinic_address: '88 Spine Rd, Houston',
        clinic_zip: '77001',
        experience_years: 10,
        profile_photo_url: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.65,
        reviews_count: 15,
        consultation_fee: 160.00,
        languages: 'English',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        first_name: 'Clara',
        last_name: 'Dupont',
        license_number: 'MD-100239',
        specialization_id: 6, // Pulmonologist
        clinic_name: 'Lungs & Thoracic Care',
        clinic_address: '320 Respiratory Way, Denver',
        clinic_zip: '80202',
        experience_years: 15,
        profile_photo_url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.80,
        reviews_count: 31,
        consultation_fee: 180.00,
        languages: 'English, French',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        first_name: 'Raj',
        last_name: 'Patel',
        license_number: 'MD-100240',
        specialization_id: 7, // Dermatologist
        clinic_name: 'Patel Dermatology & Skincare',
        clinic_address: '500 Radiant Ave, New York',
        clinic_zip: '10001',
        experience_years: 6,
        profile_photo_url: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.75,
        reviews_count: 22,
        consultation_fee: 110.00,
        languages: 'English, Hindi, Gujarati',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 9,
        first_name: 'Emily',
        last_name: 'Watson',
        license_number: 'MD-100241',
        specialization_id: 8, // Psychiatrist
        clinic_name: 'Mind & Behavior Clinic',
        clinic_address: '15 Harmony Lane, Seattle',
        clinic_zip: '98101',
        experience_years: 20,
        profile_photo_url: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.90,
        reviews_count: 67,
        consultation_fee: 200.00,
        languages: 'English',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        first_name: 'Anita',
        last_name: 'Desai',
        license_number: 'MD-100242',
        specialization_id: 9, // Gynecologist
        clinic_name: 'Desai Women Health Center',
        clinic_address: '67 Liberty Dr, Suite C, Miami',
        clinic_zip: '33101',
        experience_years: 11,
        profile_photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.88,
        reviews_count: 40,
        consultation_fee: 140.00,
        languages: 'English, Spanish, Hindi',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 11,
        first_name: 'Ken',
        last_name: 'Takahashi',
        license_number: 'MD-100243',
        specialization_id: 10, // Pediatrician
        clinic_name: 'Takahashi Pediatric Associates',
        clinic_address: '900 Cherry Blossom Way, Portland',
        clinic_zip: '97201',
        experience_years: 9,
        profile_photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
        rating_avg: 4.82,
        reviews_count: 18,
        consultation_fee: 100.00,
        languages: 'English, Japanese',
        is_verified: true,
        created_by_admin_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('doctors', doctors, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('doctors', null, {});
  }
};
