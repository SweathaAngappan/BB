const express = require('express');
const router = express.Router();
const dieticianController = require('../controllers/dieticianController');
const reviewRoutes = require('./reviewRoutes');
const upload = require('../middleware/upload');

const ensureLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) return next();
  req.session.error = 'Please login first';
  res.redirect('/login');
};

// Self-profile
router.get('/profile', ensureLoggedIn, dieticianController.selfProfile);
router.post('/profile/update', ensureLoggedIn, upload.single('qrCode'), dieticianController.updateProfile);

// Dietician client diet plan
router.get('/plan/:userId', ensureLoggedIn, dieticianController.verifyDieticianAppointment, dieticianController.getPlanForUser);
router.post('/plan/:userId', ensureLoggedIn, dieticianController.verifyDieticianAppointment, dieticianController.createOrUpdatePlan);

// List all dieticians (public search)
router.get('/', dieticianController.list);

router.use('/reviews', reviewRoutes);

// Public profile by ID
router.get('/:id', dieticianController.showProfile);

module.exports = router;
