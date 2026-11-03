const Appointment = require('../models/Appointment');
const Dietician = require('../models/Dietician');
const DietPlan = require('../models/DietPlan');
const User = require('../models/User');
const transporter = require('../utils/mailer');
const Razorpay = require('razorpay');
const { getClinicalMetabolicStatus } = require('../utils/adherenceEngine');

// Helper to safely get user ID from session
const getUserId = (req) => req.session?.user?._id || req.session?.user?.id;

// -----------------------------------------------------
// BOOKING PAGE
// -----------------------------------------------------
exports.bookPage = async (req, res) => {
  try {
    if (!req.session.user) {
      req.session.error = "Please login before booking an appointment";
      return res.redirect('/login');
    }

    const dietician = await Dietician.findById(req.params.id)
      .populate('user')
      .lean();

    if (!dietician) {
      req.session.error = "Dietician profile not found";
      return res.redirect('/dieticians');
    }

    res.render('appointment-book', { dietician });
  } catch (err) {
    console.error("BOOK PAGE ERROR:", err);
    req.session.error = "Cannot load booking page";
    res.redirect('/dieticians');
  }
};

// -----------------------------------------------------
// CREATE APPOINTMENT (Show checkout page)
// -----------------------------------------------------
exports.create = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      req.session.error = 'You must be logged in to book';
      return res.redirect('/login');
    }

    const { dieticianId, date, mode, notes } = req.body;
    const dietician = await Dietician.findById(dieticianId).populate('user').lean();

    if (!dietician) throw new Error("Dietician not found");

    res.render('checkout', { dietician, date, mode, notes });
  } catch (err) {
    console.error("APPOINTMENT CREATE ERROR:", err);
    req.session.error = 'Failed to start booking: ' + err.message;
    const redirectPath = req.body.dieticianId ? `/appointments/book/${req.body.dieticianId}` : '/dieticians';
    res.redirect(redirectPath);
  }
};

// -----------------------------------------------------
// USER APPOINTMENTS LIST
// -----------------------------------------------------
exports.myAppointments = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      req.session.error = 'Please login first';
      return res.redirect('/login');
    }

    const appts = await Appointment.find({ user: userId })
      .populate({
        path: 'dietician',
        populate: { path: 'user', select: 'name email phone profileImage' }
      })
      .sort({ date: -1 })
      .lean();

    res.render('my-appointments', { appointments: appts });
  } catch (err) {
    console.error("APPOINTMENT LOAD ERROR:", err);
    req.session.error = "Cannot load your appointments";
    res.redirect('/');
  }
};

// -----------------------------------------------------
// CANCEL APPOINTMENT
// -----------------------------------------------------
exports.cancel = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const appt = await Appointment.findOne({
      _id: req.params.id,
      $or: [
        { user: userId },
        { dietician: await Dietician.findOne({ user: userId }).select('_id') }
      ]
    });

    if (!appt) {
      req.session.error = "Appointment not found or unauthorized";
      return res.redirect('/appointments/my');
    }

    appt.status = 'cancelled';
    appt.cancelReason = req.body.reason || "Cancelled by user";
    await appt.save();

    req.session.success = "Appointment cancelled successfully.";
    res.redirect('back');
  } catch (err) {
    console.error("CANCEL ERROR:", err);
    req.session.error = "Could not cancel appointment";
    res.redirect('/appointments/my');
  }
};

// -----------------------------------------------------
// MARK APPOINTMENT COMPLETED (Dietician)
// -----------------------------------------------------
exports.completeAppointment = async (req, res) => {
  try {
    const userId = getUserId(req);
    const dietician = await Dietician.findOne({ user: userId });
    if (!dietician) {
      req.session.error = "Unauthorized";
      return res.redirect('/');
    }

    const { dieticianNotes } = req.body;
    const appt = await Appointment.findOne({
      _id: req.params.id,
      dietician: dietician._id
    });

    if (!appt) {
      req.session.error = "Appointment not found";
      return res.redirect('/appointments/clients');
    }

    appt.status = 'completed';
    if (dieticianNotes) appt.dieticianNotes = dieticianNotes;
    await appt.save();

    req.session.success = "Consultation marked as Completed!";
    res.redirect('/appointments/clients');
  } catch (err) {
    console.error("COMPLETE APPOINTMENT ERROR:", err);
    req.session.error = "Error updating appointment status";
    res.redirect('/appointments/clients');
  }
};

// -----------------------------------------------------
// SEND REMINDER
// -----------------------------------------------------
exports.sendReminder = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const appt = await Appointment.findOne({
      _id: req.params.id,
      user: userId
    }).populate({
      path: "dietician",
      populate: { path: "user", select: "email name" }
    });

    if (!appt) {
      req.session.error = "Appointment not found";
      return res.redirect('/appointments/my');
    }

    try {
      if (process.env.GMAIL_USER) {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: appt.dietician.user.email,
          subject: "Consultation Reminder 🔔 - The Balanced Bowl",
          html: `
            <h2>Reminder from ${req.session.user.name}</h2>
            <p>They would like to remind you about the upcoming consultation.</p>
            <p><strong>Date & Time:</strong> ${new Date(appt.date).toLocaleString()}</p>
            <p><strong>Mode:</strong> ${appt.mode}</p>
          `
        });
      }
    } catch (emailErr) {
      console.warn("REMINDER EMAIL NOTICE:", emailErr.message);
    }

    appt.lastReminderAt = new Date();
    await appt.save();

    req.session.success = "Reminder notification sent to dietician!";
    res.redirect('/appointments/my');
  } catch (err) {
    console.error("REMINDER ERROR:", err);
    req.session.error = "Could not send reminder";
    res.redirect('/appointments/my');
  }
};

// -----------------------------------------------------
// STEP 1: Show checkout page
// -----------------------------------------------------
exports.showCheckout = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const { dieticianId, date, mode, notes } = req.body;
    const dietician = await Dietician.findById(dieticianId).populate('user').lean();

    if (!dietician) throw new Error("Dietician not found");

    res.render('checkout', { dietician, date, mode, notes });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    req.session.error = err.message;
    const redirectPath = req.body.dieticianId ? `/appointments/book/${req.body.dieticianId}` : '/dieticians';
    res.redirect(redirectPath);
  }
};

// -----------------------------------------------------
// STEP 2: Process payment & create appointment
// -----------------------------------------------------
exports.processPayment = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const { dieticianId, date, mode, notes } = req.body;
    const dietician = await Dietician.findById(dieticianId).populate('user').lean();
    if (!dietician) throw new Error("Dietician not found");

    const amount = dietician.fee || 600;
    const meetingLink = mode === 'online' 
      ? `https://meet.jit.si/balancedbowl-consultation-${Date.now()}` 
      : null;

    // Create confirmed appointment
    const appt = await Appointment.create({
      user: userId,
      dietician: dieticianId,
      date: new Date(date),
      mode: mode || 'online',
      notes: notes || '',
      paymentConfirmed: true,
      amount,
      meetingLink,
      status: 'booked'
    });

    // Notify user & dietician via email if configured
    try {
      const user = await User.findById(userId).lean();
      if (user && dietician && process.env.GMAIL_USER) {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: user.email,
          subject: "Consultation Confirmed! 🎉 - The Balanced Bowl",
          html: `
            <h2>Your consultation is confirmed!</h2>
            <p>You have successfully booked a session with <strong>${dietician.user.name}</strong>.</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
            <p><strong>Mode:</strong> ${mode}</p>
            ${meetingLink ? `<p><strong>Meeting Room:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
          `
        });
      }
    } catch (emailErr) {
      console.warn("BOOKING EMAIL NOTICE:", emailErr.message);
    }

    req.session.success = `Payment of ₹${amount} successful! Your consultation is booked.`;
    res.redirect('/appointments/my');
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    req.session.error = "Payment failed or booking failed: " + err.message;
    const redirectPath = req.body.dieticianId ? `/appointments/book/${req.body.dieticianId}` : '/dieticians';
    res.redirect(redirectPath);
  }
};

// -----------------------------------------------------
// CREATE RAZORPAY ORDER (API)
// -----------------------------------------------------
exports.createOrder = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Login required" });

    const { dieticianId } = req.body;
    const dietician = await Dietician.findById(dieticianId).lean();
    if (!dietician) return res.status(404).json({ error: "Dietician not found" });

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      const order = await razorpay.orders.create({
        amount: (dietician.fee || 600) * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
      });

      return res.json(order);
    }

    // Mock order if Razorpay credentials not configured
    res.json({
      id: `order_mock_${Date.now()}`,
      amount: (dietician.fee || 600) * 100,
      currency: "INR",
      status: "created"
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
};

// -----------------------------------------------------
// DIETICIAN: VIEW MY CLIENTS & CLINICAL METABOLIC STATUS
// -----------------------------------------------------
exports.myClients = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId || req.session.user.role !== 'dietician') {
      req.session.error = "Access restricted to dieticians";
      return res.redirect('/');
    }

    const dietician = await Dietician.findOne({ user: userId }).lean();
    if (!dietician) {
      req.session.error = "Dietician profile not found";
      return res.redirect('/profile');
    }

    // Get all appointments for this dietician
    const appointments = await Appointment.find({ dietician: dietician._id })
      .populate('user', 'name email phone age height weight gender allergies healthConditions dietaryPreference')
      .sort({ date: -1 })
      .lean();

    // Map distinct clients
    const clientsMap = {};
    for (const appt of appointments) {
      if (!appt.user) continue;
      const cId = appt.user._id.toString();
      if (!clientsMap[cId]) {
        // Fetch clinical adherence & metabolic status for each client
        const metabolicStatus = await getClinicalMetabolicStatus(appt.user._id);

        clientsMap[cId] = {
          client: appt.user,
          latestAppointment: appt,
          totalAppointments: 1,
          metabolicStatus
        };
      } else {
        clientsMap[cId].totalAppointments += 1;
      }
    }

    const clientUsers = Object.keys(clientsMap);
    const plans = await DietPlan.find({ dietician: dietician._id, user: { $in: clientUsers } }).lean();
    const planMap = plans.reduce((acc, plan) => {
      acc[plan.user.toString()] = plan;
      return acc;
    }, {});

    const clientsList = Object.values(clientsMap);

    // Count alerts (plateaus or low compliance)
    const alertCount = clientsList.filter(c => 
      c.metabolicStatus.status === 'plateau_warning' || c.metabolicStatus.status === 'at_risk'
    ).length;

    res.render('my-clients', { 
      clients: clientsList, 
      planMap,
      appointments,
      alertCount
    });
  } catch (err) {
    console.error("MY CLIENTS ERROR:", err);
    req.session.error = "Unable to load clients: " + err.message;
    res.redirect('/');
  }
};
