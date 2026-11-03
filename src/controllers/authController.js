const User = require('../models/User');
const Dietician = require('../models/Dietician');
const HealthLog = require('../models/HealthLog');

// Show registration/login pages
exports.showRegister = (req, res) => res.render('register');
exports.showLogin = (req, res) => res.render('login');

// -------------------- REGISTER --------------------
exports.register = async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      password,

      // USER fields
      u_phone,
      u_age,
      u_gender,
      u_height,
      u_weight,
      u_dietaryPreference,
      u_allergies,
      u_conditions,
      u_bio,

      // DIETICIAN fields
      d_phone,
      d_specialization,
      d_experienceYears,
      d_fee,
      d_modes,
      d_bio
    } = req.body;

    // Check if email already registered
    const existing = await User.findOne({ email });
    if (existing) {
      req.session.error = 'An account with this email already exists. Please login instead.';
      return res.redirect('/login');
    }

    // Basic user data
    const userData = { role: role || 'user', name, email, password };

    if (role === "user" || !role) {
      userData.phone = u_phone || "";
      userData.age = u_age ? Number(u_age) : null;
      userData.gender = u_gender || "female";
      userData.height = u_height ? Number(u_height) : null;
      userData.weight = u_weight ? Number(u_weight) : null;
      userData.dietaryPreference = u_dietaryPreference || "vegetarian";
      userData.allergies = u_allergies ? u_allergies.split(',').map(s => s.trim()).filter(Boolean) : [];
      userData.healthConditions = u_conditions ? u_conditions.split(',').map(s => s.trim()).filter(Boolean) : [];
      userData.bio = u_bio || "";
    }

    if (role === "dietician") {
      userData.phone = d_phone || "";
      userData.bio = d_bio || "";
    }

    // Create main user
    const createdUser = await User.create(userData);

    // ------------------ DIETICIAN: CREATE PROFILE ------------------
    if (role === "dietician") {
      const certificateFiles = req.files
        ? req.files.map(f => `/uploads/certificates/${f.filename}`)
        : [];

      const dieticianDoc = new Dietician({
        user: createdUser._id,
        certificates: certificateFiles,
        specialization: d_specialization
          ? d_specialization.split(",").map(s => s.trim())
          : ['General Nutrition'],
        experienceYears: d_experienceYears ? Number(d_experienceYears) : 1,
        fee: d_fee ? Number(d_fee) : 600,
        consultationModes: d_modes
          ? d_modes.split(",").map(s => s.trim())
          : ['online']
      });

      await dieticianDoc.save();

      req.session.user = {
        id: createdUser._id,
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role
      };

      req.session.success = "Dietician registration successful! Welcome to the panel.";
      return res.redirect("/dieticians/profile");
    }

    // ------------------ REGULAR USER ------------------
    req.session.user = {
      id: createdUser._id,
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      height: createdUser.height,
      weight: createdUser.weight
    };

    req.session.success = `Welcome to The Balanced Bowl, ${createdUser.name}! Let's build your wellness journey.`;
    res.redirect("/user/profile");

  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    req.session.error = "Registration failed: " + err.message;
    res.redirect("/register");
  }
};

// -------------------- LOGIN --------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.session.error = 'Invalid email or password.';
      return res.redirect('/login');
    }

    req.session.user = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      height: user.height,
      weight: user.weight
    };
    req.session.success = `Welcome back, ${user.name}!`;

    // Role-specific landing redirect
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }
    if (user.role === 'dietician') {
      return res.redirect('/appointments/clients');
    }
    
    // Regular user
    const redirectTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    req.session.error = 'Login error occurred';
    res.redirect('/login');
  }
};

// -------------------- LOGOUT --------------------
exports.logout = (req, res) => {
  req.session.destroy(err => {
    res.clearCookie('bb.sid.v3');
    res.redirect('/');
  });
};

// -------------------- SHOW PROFILE --------------------
exports.showProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      req.session.error = 'Login to view profile';
      return res.redirect('/login');
    }

    if (req.session.user.role === 'admin') {
      return res.redirect('/admin');
    }
    if (req.session.user.role === 'dietician') {
      return res.redirect('/dieticians/profile');
    }

    return res.redirect('/user/profile');
  } catch (err) {
    console.error('PROFILE ROUTING ERROR:', err);
    res.redirect('/');
  }
};
