export const protienCalorieRange = (
    weight = 70,
    goal = 'default',
  ) => {
    // Basal Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
  
    // Adjust based on goal
    let protienRange = .70* weight; // Assuming sedentary activity level
  
    if (goal === 'cut') {
        protienRange -= 20; // Caloric deficit
    } else if (goal === 'bulk') {
        protienRange += 20; // Caloric surplus
    }
  
    return Math.round(protienRange);
  };
  