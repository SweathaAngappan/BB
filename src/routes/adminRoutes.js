const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');

// Role-based admin-only guard
const adminOnly = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.session && (req.session.error = 'Access restricted to administrators only.');
  res.redirect('/login');
};

router.get('/', adminOnly, admin.dashboard);
router.post('/toggle-verify/:id', adminOnly, admin.toggleDieticianVerification);
router.post('/change-role/:id', adminOnly, admin.changeUserRole);
router.post('/delete-user/:id', adminOnly, admin.deleteUser);
router.post('/delete-story/:id', adminOnly, admin.deleteStory);
router.post('/delete-review/:id', adminOnly, admin.deleteReview);

module.exports = router;
