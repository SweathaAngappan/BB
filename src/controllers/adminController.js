const User = require('../models/User');
const Dietician = require('../models/Dietician');
const Appointment = require('../models/Appointment');
const DietPlan = require('../models/DietPlan');
const HealthLog = require('../models/HealthLog');
const MealLog = require('../models/MealLog');
const Story = require('../models/Story');
const Review = require('../models/Review');

exports.dashboard = async (req, res) => {
  try {
    const [
      users,
      dieticians,
      appointments,
      dietPlans,
      healthLogsCount,
      mealLogsCount,
      stories,
      reviews
    ] = await Promise.all([
      User.find().sort({ createdAt: -1 }).lean(),
      Dietician.find().populate('user').lean(),
      Appointment.find().populate('user dietician').sort({ date: -1 }).lean(),
      DietPlan.find().lean(),
      HealthLog.countDocuments(),
      MealLog.countDocuments(),
      Story.find().sort({ createdAt: -1 }).lean(),
      Review.find().populate('user dietician').sort({ createdAt: -1 }).lean()
    ]);

    // Financial & Operational Metrics
    const totalRevenue = appointments
      .filter(a => a.paymentConfirmed || a.status === 'completed' || a.status === 'booked')
      .reduce((acc, a) => {
        const fee = a.amount || (a.dietician && a.dietician.fee) || 500;
        return acc + fee;
      }, 0);

    const completedAppts = appointments.filter(a => a.status === 'completed').length;
    const bookedAppts = appointments.filter(a => a.status === 'booked').length;
    const cancelledAppts = appointments.filter(a => a.status === 'cancelled').length;

    // Platform-wide adherence average
    const recentLogs = await HealthLog.find({ adherenceScore: { $exists: true } }).limit(100).lean();
    const avgAdherence = recentLogs.length > 0 
      ? Math.round(recentLogs.reduce((acc, l) => acc + (l.adherenceScore || 0), 0) / recentLogs.length) 
      : 84;

    res.render('admin/admin-dashboard', {
      users,
      dieticians: dieticians.filter(d => d.user),
      appointments,
      dietPlansCount: dietPlans.length,
      healthLogsCount,
      mealLogsCount,
      stories,
      reviews,
      stats: {
        totalUsers: users.length,
        totalDieticians: dieticians.length,
        totalAppointments: appointments.length,
        completedAppts,
        bookedAppts,
        cancelledAppts,
        totalRevenue,
        avgAdherence
      }
    });
  } catch (err) {
    console.error('ADMIN DASHBOARD ERROR:', err);
    req.session.error = 'Could not load admin dashboard: ' + err.message;
    res.redirect('/');
  }
};

exports.toggleDieticianVerification = async (req, res) => {
  try {
    const dietician = await Dietician.findById(req.params.id);
    if (!dietician) {
      req.session.error = 'Dietician not found';
      return res.redirect('/admin');
    }
    dietician.isVerified = !dietician.isVerified;
    await dietician.save();

    req.session.success = `Dietician verification ${dietician.isVerified ? 'granted (Verified ✅)' : 'revoked'}`;
    res.redirect('/admin');
  } catch (err) {
    console.error('VERIFICATION TOGGLE ERROR:', err);
    req.session.error = 'Error updating dietician verification';
    res.redirect('/admin');
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'dietician', 'admin'].includes(role)) {
      req.session.error = 'Invalid role specified';
      return res.redirect('/admin');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      req.session.error = 'User not found';
      return res.redirect('/admin');
    }

    user.role = role;
    await user.save();

    // If upgraded to dietician and no Dietician record exists, create one
    if (role === 'dietician') {
      const existing = await Dietician.findOne({ user: user._id });
      if (!existing) {
        await Dietician.create({
          user: user._id,
          specialization: ['General Nutrition', 'Wellness'],
          experienceYears: 2,
          fee: 500,
          consultationModes: ['online']
        });
      }
    }

    req.session.success = `Role for ${user.name} changed to ${role}`;
    res.redirect('/admin');
  } catch (err) {
    console.error('ROLE CHANGE ERROR:', err);
    req.session.error = 'Error modifying user role';
    res.redirect('/admin');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Prevent self-deletion if logged in admin
    if (req.session.user && req.session.user._id && req.session.user._id.toString() === userId) {
      req.session.error = 'Cannot delete your own active admin account';
      return res.redirect('/admin');
    }

    await User.findByIdAndDelete(userId);
    await Dietician.deleteMany({ user: userId });
    await Appointment.deleteMany({ user: userId });
    await DietPlan.deleteMany({ user: userId });
    await HealthLog.deleteMany({ user: userId });
    await MealLog.deleteMany({ user: userId });

    req.session.success = 'User and associated data removed successfully';
    res.redirect('/admin');
  } catch (err) {
    console.error('DELETE USER ERROR:', err);
    req.session.error = 'Error removing user: ' + err.message;
    res.redirect('/admin');
  }
};

exports.deleteStory = async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    req.session.success = 'Story deleted';
    res.redirect('/admin');
  } catch (err) {
    req.session.error = 'Failed to delete story';
    res.redirect('/admin');
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    req.session.success = 'Review removed';
    res.redirect('/admin');
  } catch (err) {
    req.session.error = 'Failed to delete review';
    res.redirect('/admin');
  }
};
