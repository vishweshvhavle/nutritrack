import React, { useState, useEffect } from 'react';

// Dummy data for meal plans
const mealPlans = [
  {
    id: 1,
    isVeg: true,
    meals: [
      { name: 'Breakfast', description: 'Vegan protein smoothie bowl', calories: 300 },
      { name: 'Lunch', description: 'Quinoa and black bean salad', calories: 400 },
      { name: 'Snack', description: 'Mixed nuts and dried fruits', calories: 150 },
      { name: 'Dinner', description: 'Grilled vegetable skewers with hummus', calories: 350 },
    ],
    ingredients: ['Vegan protein powder', 'Berries', 'Quinoa', 'Black beans', 'Mixed nuts', 'Dried fruits', 'Assorted vegetables', 'Hummus']
  },
  {
    id: 2,
    isVeg: false,
    meals: [
      { name: 'Breakfast', description: 'Greek yogurt with honey and walnuts', calories: 300 },
      { name: 'Lunch', description: 'Grilled chicken caesar salad', calories: 400 },
      { name: 'Snack', description: 'Apple slices with almond butter', calories: 150 },
      { name: 'Dinner', description: 'Baked salmon with roasted vegetables', calories: 400 },
    ],
    ingredients: ['Greek yogurt', 'Honey', 'Walnuts', 'Chicken breast', 'Romaine lettuce', 'Caesar dressing', 'Apple', 'Almond butter', 'Salmon fillet', 'Assorted vegetables']
  },
];

const assignMealPlan = (date) => {
  const day = date.getDay();
  const dayOfMonth = date.getDate();
  const monthIndex = date.getMonth();
  
  const vegPlans = mealPlans.filter(plan => plan.isVeg);
  const nonVegPlans = mealPlans.filter(plan => !plan.isVeg);
  
  if (day === 1 || day === 6) {
    return vegPlans[(dayOfMonth + monthIndex) % vegPlans.length];
  } else {
    return nonVegPlans[(dayOfMonth + monthIndex) % nonVegPlans.length];
  }
};

const DietTracker = () => {
  const [completedMeals, setCompletedMeals] = useState({});
  const [todaysPlan, setTodaysPlan] = useState(null);
  const [nextWeekIngredients, setNextWeekIngredients] = useState([]);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    const today = new Date();
    const plan = assignMealPlan(today);
    setTodaysPlan(plan);

    const nextWeekIngs = new Set();
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const nextPlan = assignMealPlan(nextDate);
      nextPlan.ingredients.forEach(ing => nextWeekIngs.add(ing));
    }
    setNextWeekIngredients(Array.from(nextWeekIngs));
  }, []);

  const handleMealCompletion = (mealName) => {
    setCompletedMeals(prev => ({
      ...prev,
      [mealName]: !prev[mealName]
    }));
  };

  const handleIngredientCheck = (ingredient) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [ingredient]: !prev[ingredient]
    }));
  };

  const calculateProgress = () => {
    if (!todaysPlan) return 0;
    const completedCount = Object.values(completedMeals).filter(Boolean).length;
    return (completedCount / todaysPlan.meals.length) * 100;
  };

  if (!todaysPlan) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 sm:p-8 text-blue-100" style={{fontFamily: 'Arial, sans-serif'}}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-900 rounded-lg shadow-lg mb-8 overflow-hidden">
        <div className="border-b border-blue-900 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
              Today's Meal Plan
            </h2>
            <span className={`px-2 py-1 rounded text-white text-sm font-bold ${todaysPlan.isVeg ? 'bg-green-700' : 'bg-red-700'}`}>
              {todaysPlan.isVeg ? "Veg" : "Non-Veg"}
            </span>
          </div>
          <div className="mt-2 bg-blue-900 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600" 
              style={{width: `${calculateProgress()}%`}}
            />
          </div>
        </div>
        <div className="p-4">
          {todaysPlan.meals.map((meal) => (
            <div key={meal.name} className="mb-4 sm:mb-6">
              <button
                onClick={() => handleMealCompletion(meal.name)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                  completedMeals[meal.name]
                    ? 'bg-blue-900 bg-opacity-30 text-blue-300'
                    : 'bg-gradient-to-r from-blue-800 to-blue-900 text-blue-100'
                }`}
              >
                <div className="font-semibold">{meal.name}</div>
                <div className="text-sm mt-1">{meal.description}</div>
                <div className="text-sm font-medium mt-1">{meal.calories} cal</div>
              </button>
            </div>
          ))}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-blue-900">
            <p className="text-right text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
              Total: {todaysPlan.meals.reduce((sum, meal) => sum + meal.calories, 0)} cal
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-900 rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-blue-900 p-4">
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
            Next 7 Days Ingredients
          </h2>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {nextWeekIngredients.map((ingredient, index) => (
              <button
                key={index}
                onClick={() => handleIngredientCheck(ingredient)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  checkedIngredients[ingredient]
                    ? 'bg-blue-900 bg-opacity-30 text-blue-300'
                    : 'bg-gradient-to-r from-blue-800 to-blue-900 text-blue-100'
                }`}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietTracker;
