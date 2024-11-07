// src/utils/calorieCalculator.js
export const calculateCalorieRange = (
  weight = 70,
  height = 170,
  sex = 'other',
  goal = 'default',
  age = 20
) => {
  // Basal Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
  let bmr;

  if (sex === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (sex === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // Default calculation
    bmr = 10 * weight + 6.25 * height - 5 * age;
  }

  // Adjust based on goal
  let calorieRange = bmr * 1.2; // Assuming sedentary activity level

  if (goal === 'cut') {
    calorieRange -= 500; // Caloric deficit
  } else if (goal === 'bulk') {
    calorieRange += 500; // Caloric surplus
  }

  return Math.round(calorieRange);
};
