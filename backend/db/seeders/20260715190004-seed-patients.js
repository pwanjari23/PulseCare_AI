'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const patients = [];
    const firstNames = ['John', 'Jane', 'James', 'Patricia', 'Robert', 'Linda', 'Michael', 'Barbara', 'William', 'Elizabeth', 'David', 'Jennifer', 'Richard', 'Maria', 'Joseph', 'Susan', 'Thomas', 'Margaret', 'Charles', 'Dorothy', 'Christopher', 'Lisa', 'Daniel', 'Nancy', 'Matthew'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'];
    const genders = ['Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male'];
    const bloodTypes = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

    for (let i = 1; i <= 25; i++) {
      const id = i + 11; // IDs 12 - 36
      const gender = genders[i - 1];
      const bloodType = bloodTypes[i % 8];
      
      // Calculate age/dob
      const birthYear = 1960 + (i * 2);
      const dob = `${birthYear}-05-12`;

      // Set primary doctor ID: distribute patients among doctors (IDs 2 - 11)
      const primaryDoctorId = (i % 10) + 2; 

      patients.push({
        id,
        first_name: firstNames[i - 1],
        last_name: lastNames[i - 1],
        date_of_birth: dob,
        gender,
        blood_type: bloodType,
        zip_code: `902${10 + i}`,
        primary_doctor_id: i <= 20 ? primaryDoctorId : null, // 5 patients don't have primary doctors yet
        profile_photo_url: gender === 'Male' 
          ? `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150`
          : `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150`,
        height_cm: 155.00 + (i * 1.2),
        emergency_contact_name: `Contact Name ${i}`,
        emergency_contact_phone: `+1555099${String(i).padStart(2, '0')}`,
        emergency_contact_relation: i % 2 === 0 ? 'Spouse' : 'Parent',
        medical_conditions: i % 3 === 0 ? 'Type 2 Diabetes, Hypertension' : i % 5 === 0 ? 'Chronic Asthma' : 'None',
        allergies: i % 4 === 0 ? 'Penicillin' : 'None',
        smoking_status: i % 4 === 0 ? 'Active smoker' : i % 6 === 0 ? 'Former smoker' : 'Non-smoker',
        alcohol_consumption: i % 3 === 0 ? 'Regular' : i % 5 === 0 ? 'Occasional' : 'None',
        last_vital_submitted_at: new Date(Date.now() - (i % 3) * 3600000),
        profile_completion_pct: 75 + (i % 5) * 5,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('patients', patients, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('patients', null, {});
  }
};
