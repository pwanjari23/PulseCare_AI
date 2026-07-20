/**
 * Calculates age in years from date of birth
 */
export const calculateAgeFromDOB = (dobStr) => {
  if (!dobStr) return 35; // Default fallback age
  const dob = new Date(dobStr);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

/**
 * Calculates BMI index from height (cm) and weight (kg)
 */
export const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg) return null;
  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
  else if (bmi >= 30) category = 'Obese';

  return { bmi, category };
};

/**
 * Returns badge styling for patient status
 */
export const getPatientStatusStyle = (status = 'Active') => {
  const s = String(status).toLowerCase();
  if (s === 'active') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (s === 'inactive') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
};
