const User = require('../models/User');
const Dietician = require('../models/Dietician');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const DietPlan = require('../models/DietPlan');
const HealthLog = require('../models/HealthLog');
const MealLog = require('../models/MealLog');
const { checkMealContraindications } = require('../utils/contraindicationShield');
const { getClinicalMetabolicStatus } = require('../utils/adherenceEngine');

exports.list = async (req, res) => {
  try {
    const query = req.query.q ? req.query.q.trim() : '';
    const specializationFilter = req.query.specialization || '';
    const modeFilter = req.query.mode || '';

    let userQuery = { role: 'dietician' };
    if (query) {
      userQuery.name = { $regex: query, $options: 'i' };
    }

    const matchingUsers = await User.find(userQuery).select('_id').lean();
    const userIds = matchingUsers.map(u => u._id);

    let dieticianFilter = { user: { $in: userIds } };
    if (specializationFilter) {
      dieticianFilter.specialization = { $in: [new RegExp(specializationFilter, 'i')] };
    }
    if (modeFilter) {
      dieticianFilter.consultationModes = { $in: [modeFilter] };
    }

    let dieticians = await Dietician.find(dieticianFilter)
      .populate('user')
      .sort({ rating: -1, isVerified: -1 })
      .lean();

    // Filter out any orphans
    dieticians = dieticians.filter(d => d.user);

    res.render('dietician-list', {
      dieticians,
      query: req.query,
      currentFilter: { q: query, specialization: specializationFilter, mode: modeFilter }
    });
  } catch (err) {
    console.error('DIETICIAN LIST ERROR:', err);
    req.session.error = 'Cannot load dieticians list';
    res.redirect('/');
  }
};

exports.showProfile = async (req, res) => {
  try {
    const dietician = await Dietician.findById(req.params.id).populate('user').lean();
    if (!dietician) {
      req.session.error = 'Dietician profile not found';
      return res.redirect('/dieticians');
    }

    const reviews = await Review.find({ dietician: dietician._id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 })
      .lean();

    res.render('dietician-profile', {
      dietician,
      reviews,
      loggedInRole: req.session.user ? req.session.user.role : null
    });
  } catch (err) {
    console.error('SHOW PROFILE ERROR:', err);
    req.session.error = 'Failed to load profile';
    res.redirect('/dieticians');
  }
};

exports.selfProfile = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      req.session.error = "Please login to view your profile";
      return res.redirect('/login');
    }

    const dbUser = await User.findById(req.session.user._id).lean();
    if (!dbUser || dbUser.role !== 'dietician') {
      req.session.error = "Only dieticians can access this section";
      return res.redirect('/');
    }

    let dietician = await Dietician.findOne({ user: dbUser._id }).lean();
    if (!dietician) {
      // Auto-create initial dietician profile if missing
      dietician = await Dietician.create({
        user: dbUser._id,
        specialization: ['General Nutrition', 'Weight Management'],
        experienceYears: 2,
        fee: 600,
        consultationModes: ['online', 'offline']
      });
      dietician = dietician.toObject();
    }

    const reviews = await Review.find({ dietician: dietician._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return res.render('dietician-profile', {
      user: dbUser,
      dietician: { ...dietician, user: dbUser },
      reviews,
      loggedInRole: dbUser.role,
      isSelf: true
    });
  } catch (err) {
    console.error("SELF PROFILE ERROR:", err);
    req.session.error = "Cannot load your dietician profile";
    res.redirect('/');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.session || !req.session.user || req.session.user.role !== 'dietician') {
      req.session.error = "Unauthorized";
      return res.redirect('/login');
    }

    const { specialization, experienceYears, fee, consultationModes, about, upiId } = req.body;

    const dietician = await Dietician.findOne({ user: req.session.user._id });
    if (!dietician) {
      req.session.error = "Dietician record not found";
      return res.redirect('/');
    }

    if (specialization) {
      dietician.specialization = Array.isArray(specialization) 
        ? specialization 
        : specialization.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (consultationModes) {
      dietician.consultationModes = Array.isArray(consultationModes)
        ? consultationModes
        : consultationModes.split(',').map(m => m.trim()).filter(Boolean);
    }
    if (experienceYears !== undefined) dietician.experienceYears = Number(experienceYears);
    if (fee !== undefined) dietician.fee = Number(fee);
    if (about !== undefined) dietician.about = about;
    if (upiId !== undefined) dietician.upiId = upiId;

    if (req.file) {
      dietician.qrCodeUrl = `/uploads/${req.file.filename}`;
    }

    await dietician.save();

    req.session.success = "Dietician profile updated successfully!";
    res.redirect('/dieticians/profile');
  } catch (err) {
    console.error("UPDATE DIETICIAN PROFILE ERROR:", err);
    req.session.error = "Failed to update profile";
    res.redirect('/dieticians/profile');
  }
};

async function verifyDieticianAppointment(req, res, next) {
  try {
    if (!req.session || !req.session.user) {
      req.session.error = 'Please login first';
      return res.redirect('/login');
    }

    const user = await User.findById(req.session.user._id).lean();
    if (!user || user.role !== 'dietician') {
      req.session.error = 'Access denied: Dieticians only';
      return res.redirect('/');
    }

    const dietician = await Dietician.findOne({ user: user._id }).lean();
    if (!dietician) {
      req.session.error = 'Dietician profile record not found';
      return res.redirect('/');
    }

    // Verify dietician has an appointment with the specified client
    const appointment = await Appointment.findOne({
      dietician: dietician._id,
      user: req.params.userId
    });

    if (!appointment) {
      req.session.error = 'No client relationship found for this user';
      return res.redirect('/appointments/clients');
    }

    req.dieticianProfile = dietician;
    next();
  } catch (err) {
    console.error('VERIFY DIETICIAN APPOINTMENT ERROR:', err);
    req.session.error = 'Unable to verify client access';
    res.redirect('/dieticians');
  }
}

exports.verifyDieticianAppointment = verifyDieticianAppointment;

// GET Diet Plan Builder for a specific client
exports.getPlanForUser = async (req, res) => {
  try {
    const dietician = req.dieticianProfile;
    const client = await User.findById(req.params.userId).lean();
    if (!client) {
      req.session.error = 'Client record not found';
      return res.redirect('/appointments/clients');
    }

    const plan = await DietPlan.findOne({
      dietician: dietician._id,
      user: req.params.userId
    }).lean();

    // Check for potential allergy / clinical contraindications
    const warnings = plan && plan.meals 
      ? checkMealContraindications(plan.meals, client.allergies, client.healthConditions)
      : [];

    res.render('diet-plan', {
      client,
      plan,
      dietician,
      warnings,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      mealTypes: ['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner']
    });
  } catch (err) {
    console.error('GET PLAN FOR USER ERROR:', err);
    req.session.error = 'Unable to load client diet plan';
    res.redirect('/appointments/clients');
  }
};

// POST Create or Update Diet Plan
exports.createOrUpdatePlan = async (req, res) => {
  try {
    const dietician = req.dieticianProfile;
    const { 
      goal, 
      startDate, 
      active, 
      targetCaloriesDaily, 
      targetProteinDaily, 
      targetCarbsDaily, 
      targetFatsDaily, 
      clinicalNotes, 
      meals 
    } = req.body;

    let mealsParsed = [];
    if (typeof meals === 'string') {
      try {
        mealsParsed = JSON.parse(meals || '[]');
      } catch (e) {
        mealsParsed = [];
      }
    } else if (Array.isArray(meals)) {
      mealsParsed = meals;
    }

    const formattedMeals = mealsParsed.map(m => ({
      day: m.day || 'Monday',
      mealType: m.mealType || 'Breakfast',
      item: m.item || '',
      portion: m.portion || '1 serving',
      calories: Number(m.calories) || 0,
      protein: Number(m.protein) || 0,
      carbs: Number(m.carbs) || 0,
      fats: Number(m.fats) || 0,
      fiber: Number(m.fiber) || 0,
      tags: Array.isArray(m.tags) ? m.tags : (m.tags ? m.tags.split(',') : [])
    }));

    const client = await User.findById(req.params.userId).lean();

    // Perform clinical contraindication check
    const contraindications = checkMealContraindications(
      formattedMeals, 
      client ? client.allergies : [], 
      client ? client.healthConditions : []
    );

    const plan = await DietPlan.findOneAndUpdate(
      { dietician: dietician._id, user: req.params.userId },
      {
        dietician: dietician._id,
        user: req.params.userId,
        goal: goal || 'Target Weight & Wellness',
        targetCaloriesDaily: Number(targetCaloriesDaily) || 1800,
        targetProteinDaily: Number(targetProteinDaily) || 75,
        targetCarbsDaily: Number(targetCarbsDaily) || 200,
        targetFatsDaily: Number(targetFatsDaily) || 50,
        clinicalNotes: clinicalNotes || '',
        meals: formattedMeals,
        startDate: startDate ? new Date(startDate) : new Date(),
        active: active === 'on' || active === 'true' || active === true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (contraindications.length > 0) {
      req.session.error = `Diet plan saved, but ${contraindications.length} Clinical Contraindication(s) were flagged! Please review below.`;
    } else {
      req.session.success = 'Diet plan successfully saved and synced with client!';
    }

    res.redirect(`/dieticians/plan/${req.params.userId}`);
  } catch (err) {
    console.error('CREATE OR UPDATE PLAN ERROR:', err);
    req.session.error = 'Unable to save diet plan: ' + err.message;
    res.redirect(`/dieticians/plan/${req.params.userId}`);
  }
};
