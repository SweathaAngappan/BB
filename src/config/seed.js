/**
 * Database Seeder for The Balanced Bowl
 * Creates verified Admin, Dieticians, Users, 7-Day Diet Plans, Meal Logs, and Health Trajectories.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Dietician = require('../models/Dietician');
const DietPlan = require('../models/DietPlan');
const Appointment = require('../models/Appointment');
const HealthLog = require('../models/HealthLog');
const MealLog = require('../models/MealLog');
const Story = require('../models/Story');
const Review = require('../models/Review');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/balancedbowl';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing test collections (preserving schema indexes)
    await Promise.all([
      User.deleteMany({}),
      Dietician.deleteMany({}),
      DietPlan.deleteMany({}),
      Appointment.deleteMany({}),
      HealthLog.deleteMany({}),
      MealLog.deleteMany({}),
      Story.deleteMany({}),
      Review.deleteMany({})
    ]);

    console.log('Cleared existing collections.');

    // 1. Create ADMIN user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@balancedbowl.com',
      password: 'admin', // will be hashed by pre-save hook
      role: 'admin',
      phone: '+91 98765 43210',
      bio: 'Platform Operations & Clinical Governance'
    });

    // 2. Create DIETICIANS
    const dieticianUser1 = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'sarah@balancedbowl.com',
      password: 'sarah',
      role: 'dietician',
      phone: '+91 98765 11111',
      bio: 'Sports & Clinical Nutritionist with 8+ years experience guiding athletes and professionals to sustainable vitality.',
      location: 'Bangalore, India'
    });

    const dieticianDoc1 = await Dietician.create({
      user: dieticianUser1._id,
      specialization: ['Weight Loss', 'Sports Nutrition', 'PCOS Management'],
      experienceYears: 8,
      fee: 750,
      consultationModes: ['online', 'in-person'],
      rating: 4.9,
      reviewsCount: 38,
      isVerified: true,
      about: 'Specialized in metabolic balance, high-protein plant-forward nutrition, and athletic endurance recovery.',
      upiId: 'sarahjenkins@okaxis',
      languages: ['English', 'Hindi', 'Tamil']
    });

    const dieticianUser2 = await User.create({
      name: 'Dr. Vikram Sharma',
      email: 'vikram@balancedbowl.com',
      password: 'vikram',
      role: 'dietician',
      phone: '+91 98765 22222',
      bio: 'Endocrinological Diet Consultant specializing in diabetic reversals, hypertension, and gut microbiome optimization.',
      location: 'Mumbai, India'
    });

    const dieticianDoc2 = await Dietician.create({
      user: dieticianUser2._id,
      specialization: ['Diabetes Reversal', 'Gut Health', 'Cardiac Nutrition'],
      experienceYears: 12,
      fee: 900,
      consultationModes: ['online', 'offline'],
      rating: 4.8,
      reviewsCount: 52,
      isVerified: true,
      about: 'Focusing on low-glycemic Mediterranean & South Asian culinary fusions to naturally stabilize insulin levels.',
      upiId: 'vikramsharma@okhdfcbank',
      languages: ['English', 'Hindi']
    });

    // 3. Create CLIENT USERS
    const clientUser1 = await User.create({
      name: 'Sweatha Angappan',
      email: 'sweatha@balancedbowl.com',
      password: 'user123',
      role: 'user',
      phone: '+91 98111 22334',
      age: 24,
      gender: 'female',
      height: 165,
      weight: 62.5,
      targetWeight: 58.0,
      dietaryPreference: 'vegetarian',
      allergies: ['lactose'],
      healthConditions: ['pcos'],
      dailyCalorieTarget: 1750,
      bio: 'Software engineer passionate about fitness, clean plant-based eating, and building sustainable energy.'
    });

    const clientUser2 = await User.create({
      name: 'Alex Turner',
      email: 'alex@balancedbowl.com',
      password: 'user123',
      role: 'user',
      phone: '+91 98222 33445',
      age: 29,
      gender: 'male',
      height: 178,
      weight: 84.0,
      targetWeight: 75.0,
      dietaryPreference: 'non-vegetarian',
      allergies: ['peanuts'],
      healthConditions: ['hypertension'],
      dailyCalorieTarget: 2100,
      bio: 'Working professional aiming for lean recomposition and lowering resting blood pressure.'
    });

    // 4. Create 7-Day Balanced Diet Plan for Sweatha (prescribed by Dr. Sarah)
    const sweathaMeals = [
      // Monday
      { day: 'Monday', mealType: 'Breakfast', item: 'Rolled Oats with Almond Milk, Chia Seeds & Banana', portion: '1 bowl', calories: 280, protein: 10, carbs: 45, fats: 6, fiber: 7, tags: ['dairy-free', 'high-fiber'] },
      { day: 'Monday', mealType: 'Morning Snack', item: 'Apple Slices with 1 Tablespoon Natural Peanut Butter', portion: '1 apple', calories: 180, protein: 5, carbs: 26, fats: 8, fiber: 5, tags: ['snack'] },
      { day: 'Monday', mealType: 'Lunch', item: '2 Multigrain Rotis + Homestyle Dal Tadka + Steamed Beans Poriyal', portion: '1 plate', calories: 410, protein: 16, carbs: 68, fats: 7, fiber: 10, tags: ['high-protein', 'vegetarian'] },
      { day: 'Monday', mealType: 'Evening Snack', item: 'Roasted Makhana (Fox Nuts) with Green Tea', portion: '1 bowl', calories: 120, protein: 4, carbs: 18, fats: 3, fiber: 3, tags: ['low-calorie'] },
      { day: 'Monday', mealType: 'Dinner', item: 'Tofu & Mixed Veggie Stir-fry with Buckwheat Soba Noodles', portion: '1 large bowl', calories: 390, protein: 24, carbs: 48, fats: 10, fiber: 7, tags: ['dairy-free', 'high-protein'] },

      // Tuesday
      { day: 'Tuesday', mealType: 'Breakfast', item: 'Moong Dal Chilla (Savory Crepes) with Mint Chutney', portion: '2 chillas', calories: 260, protein: 14, carbs: 38, fats: 5, fiber: 6, tags: ['gluten-free', 'vegan'] },
      { day: 'Tuesday', mealType: 'Morning Snack', item: 'Handful of Raw Walnuts & Golden Raisins', portion: '25g', calories: 160, protein: 4, carbs: 12, fats: 12, fiber: 2, tags: ['omega-3'] },
      { day: 'Tuesday', mealType: 'Lunch', item: 'Brown Rice with Rajma Masala & Cucumber Tomato Salad', portion: '1 bowl', calories: 440, protein: 19, carbs: 72, fats: 8, fiber: 12, tags: ['high-fiber'] },
      { day: 'Tuesday', mealType: 'Evening Snack', item: 'Sprouted Moong Chaat with Pomegranate & Lime', portion: '1 cup', calories: 150, protein: 9, carbs: 26, fats: 1, fiber: 6, tags: ['superfood'] },
      { day: 'Tuesday', mealType: 'Dinner', item: 'Warm Lentil & Roasted Vegetable Soup with Sourdough', portion: '1 bowl', calories: 330, protein: 15, carbs: 50, fats: 6, fiber: 9, tags: ['comfort-food'] },

      // Wednesday
      { day: 'Wednesday', mealType: 'Breakfast', item: 'Vegetable Poha with Roasted Peanuts & Squeeze of Lemon', portion: '1 bowl', calories: 250, protein: 7, carbs: 42, fats: 6.5, fiber: 4, tags: ['vegan'] },
      { day: 'Wednesday', mealType: 'Lunch', item: '2 Multigrain Rotis + Paneer Bhurji + Fresh Salad', portion: '1 plate', calories: 420, protein: 22, carbs: 46, fats: 16, fiber: 7, tags: ['high-protein'] },
      { day: 'Wednesday', mealType: 'Dinner', item: 'Chickpea & Roasted Mediterranean Salad with Lemon Tahini', portion: '1 bowl', calories: 340, protein: 14, carbs: 44, fats: 12, fiber: 10, tags: ['vegan'] },

      // Thursday
      { day: 'Thursday', mealType: 'Breakfast', item: 'Rolled Oats with Almond Milk, Chia Seeds & Banana', portion: '1 bowl', calories: 280, protein: 10, carbs: 45, fats: 6, fiber: 7, tags: ['dairy-free'] },
      { day: 'Thursday', mealType: 'Lunch', item: 'Brown Rice + Homestyle Dal Tadka + Steamed Beans Poriyal', portion: '1 plate', calories: 410, protein: 16, carbs: 68, fats: 7, fiber: 10, tags: ['vegetarian'] },
      { day: 'Thursday', mealType: 'Dinner', item: 'Warm Lentil & Roasted Vegetable Soup with Sourdough', portion: '1 bowl', calories: 330, protein: 15, carbs: 50, fats: 6, fiber: 9, tags: ['comfort-food'] },

      // Friday
      { day: 'Friday', mealType: 'Breakfast', item: 'Moong Dal Chilla (Savory Crepes) with Mint Chutney', portion: '2 chillas', calories: 260, protein: 14, carbs: 38, fats: 5, fiber: 6, tags: ['vegan'] },
      { day: 'Friday', mealType: 'Lunch', item: 'Tofu & Mixed Veggie Stir-fry with Buckwheat Soba Noodles', portion: '1 bowl', calories: 390, protein: 24, carbs: 48, fats: 10, fiber: 7, tags: ['high-protein'] },
      { day: 'Friday', mealType: 'Dinner', item: 'Chickpea & Roasted Mediterranean Salad with Lemon Tahini', portion: '1 bowl', calories: 340, protein: 14, carbs: 44, fats: 12, fiber: 10, tags: ['vegan'] },

      // Saturday
      { day: 'Saturday', mealType: 'Breakfast', item: 'Vegetable Poha with Roasted Peanuts & Squeeze of Lemon', portion: '1 bowl', calories: 250, protein: 7, carbs: 42, fats: 6.5, fiber: 4, tags: ['vegan'] },
      { day: 'Saturday', mealType: 'Lunch', item: 'Brown Rice with Rajma Masala & Cucumber Tomato Salad', portion: '1 bowl', calories: 440, protein: 19, carbs: 72, fats: 8, fiber: 12, tags: ['high-fiber'] },
      { day: 'Saturday', mealType: 'Dinner', item: 'Tofu & Mixed Veggie Stir-fry with Buckwheat Soba Noodles', portion: '1 bowl', calories: 390, protein: 24, carbs: 48, fats: 10, fiber: 7, tags: ['dairy-free'] },

      // Sunday
      { day: 'Sunday', mealType: 'Breakfast', item: 'Rolled Oats with Almond Milk, Chia Seeds & Banana', portion: '1 bowl', calories: 280, protein: 10, carbs: 45, fats: 6, fiber: 7, tags: ['dairy-free'] },
      { day: 'Sunday', mealType: 'Lunch', item: '2 Multigrain Rotis + Homestyle Dal Tadka + Steamed Beans Poriyal', portion: '1 plate', calories: 410, protein: 16, carbs: 68, fats: 7, fiber: 10, tags: ['vegetarian'] },
      { day: 'Sunday', mealType: 'Dinner', item: 'Warm Lentil & Roasted Vegetable Soup with Sourdough', portion: '1 bowl', calories: 330, protein: 15, carbs: 50, fats: 6, fiber: 9, tags: ['comfort-food'] }
    ];

    await DietPlan.create({
      dietician: dieticianDoc1._id,
      user: clientUser1._id,
      goal: 'Lean Muscle Tone & PCOS Insulin Sensitivity',
      targetCaloriesDaily: 1750,
      targetProteinDaily: 75,
      targetCarbsDaily: 210,
      targetFatsDaily: 48,
      clinicalNotes: 'Avoid dairy due to lactose sensitivity. Emphasize low-glycemic legumes, plant proteins, and omega-3 seeds.',
      meals: sweathaMeals,
      startDate: new Date(),
      active: true
    });

    // 5. Create 14 days of historical HealthLogs & MealLogs for Sweatha
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - i);
      const normalizedDate = new Date(Date.UTC(logDate.getUTCFullYear(), logDate.getUTCMonth(), logDate.getUTCDate()));

      const weight = 64.2 - (0.12 * (14 - i)) + (Math.sin(i) * 0.15); // progressive weight loss curve

      await HealthLog.create({
        user: clientUser1._id,
        date: normalizedDate,
        weight: parseFloat(weight.toFixed(1)),
        waterIntakeMl: 2200 + (i % 3) * 200,
        calories: 1720 + ((i * 15) % 100),
        adherenceScore: 85 + ((i * 7) % 15),
        loggedCalories: 1720,
        prescribedCalories: 1750,
        mood: i % 2 === 0 ? 'Energetic' : 'Calm',
        note: `Day ${14 - i} routine feeling great.`
      });

      // Sample meal logs for recent 3 days
      if (i <= 2) {
        await MealLog.create({
          user: clientUser1._id,
          date: normalizedDate,
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][logDate.getDay()],
          mealType: 'Breakfast',
          foodName: 'Rolled Oats with Almond Milk & Chia Seeds',
          rawInput: 'Rolled oats with almond milk and chia seeds',
          calories: 280,
          protein: 10,
          carbs: 45,
          fats: 6,
          fiber: 7,
          healthGrade: 'A+',
          healthTip: 'Superb breakfast! High fiber promotes steady glucose levels.',
          status: 'eaten'
        });

        await MealLog.create({
          user: clientUser1._id,
          date: normalizedDate,
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][logDate.getDay()],
          mealType: 'Lunch',
          foodName: '2 Rotis with Dal Tadka and Cucumber Salad',
          rawInput: '2 rotis with 1 bowl dal tadka and cucumber salad',
          calories: 390,
          protein: 15,
          carbs: 58,
          fats: 8,
          fiber: 9,
          healthGrade: 'A',
          healthTip: 'Balanced macros with good plant protein.',
          status: 'eaten'
        });
      }
    }

    // 6. Create HealthLogs for Alex Turner to demonstrate METABOLIC PLATEAU ALERT
    for (let i = 14; i >= 0; i--) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - i);
      const normalizedDate = new Date(Date.UTC(logDate.getUTCFullYear(), logDate.getUTCMonth(), logDate.getUTCDate()));

      // Weight stuck at 84.0 kg for 14 days with 90% adherence -> triggers metabolic plateau warning!
      await HealthLog.create({
        user: clientUser2._id,
        date: normalizedDate,
        weight: 84.0 + (i % 2 === 0 ? 0.1 : -0.1),
        waterIntakeMl: 2600,
        calories: 1950,
        adherenceScore: 92,
        loggedCalories: 1950,
        prescribedCalories: 2100,
        mood: 'Determined',
        note: 'Stuck at current weight despite following plan.'
      });
    }

    // 7. Create APPOINTMENTS
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 3);

    const pastDate1 = new Date();
    pastDate1.setDate(pastDate1.getDate() - 10);

    await Appointment.create({
      user: clientUser1._id,
      dietician: dieticianDoc1._id,
      date: futureDate1,
      mode: 'online',
      status: 'booked',
      amount: 750,
      paymentConfirmed: true,
      meetingLink: 'https://meet.jit.si/balancedbowl-consultation-demo',
      notes: 'Monthly review on PCOS carb tolerance and body recomposition.'
    });

    await Appointment.create({
      user: clientUser1._id,
      dietician: dieticianDoc1._id,
      date: pastDate1,
      mode: 'online',
      status: 'completed',
      amount: 750,
      paymentConfirmed: true,
      dieticianNotes: 'Client successfully initiated 7-day anti-inflammatory plan. Adherence is 88%.',
      notes: 'Initial clinical assessment.'
    });

    await Appointment.create({
      user: clientUser2._id,
      dietician: dieticianDoc1._id,
      date: futureDate1,
      mode: 'in-person',
      status: 'booked',
      amount: 750,
      paymentConfirmed: true,
      notes: 'Metabolic plateau check-in.'
    });

    // 8. Create REVIEWS
    await Review.create({
      user: clientUser1._id,
      dietician: dieticianDoc1._id,
      rating: 5,
      comment: 'Dr. Sarah has been life-changing! Her personalized plan made it so easy to navigate my lactose sensitivity without sacrificing protein.'
    });

    // 9. Create SUCCESS STORIES
    await Story.create({
      name: 'Rohan Mehta',
      story: 'Lost 14 kg in 4 months with The Balanced Bowl. The 1-click meal swap feature saved me on days I did not have exact groceries at home!',
      beforeWeight: 92,
      afterWeight: 78,
      duration: '4 months',
      isApproved: true
    });

    await Story.create({
      name: 'Pooja Iyer',
      story: 'Reversed my early-stage pre-diabetes with guidance from Dr. Vikram. Having the automated grocery list made healthy cooking effortless.',
      beforeWeight: 73,
      afterWeight: 64,
      duration: '3 months',
      isApproved: true
    });

    console.log('✅ SEEDING COMPLETE!');
    console.log('--------------------------------------------------');
    console.log('Admin Account:     admin@balancedbowl.com    / admin');
    console.log('Dietician Account: sarah@balancedbowl.com    / sarah');
    console.log('Dietician Account: vikram@balancedbowl.com   / vikram');
    console.log('User Account:      sweatha@balancedbowl.com  / user123');
    console.log('User Account:      alex@balancedbowl.com     / user123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('SEEDING FAILED:', err);
    process.exit(1);
  }
}

seedDatabase();
