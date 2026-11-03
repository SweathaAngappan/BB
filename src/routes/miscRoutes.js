const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// GET share-story page
router.get('/share-story', (req, res) => {
  res.render('share-story');   
});

// POST share-story form
router.post('/share-story', async (req, res) => {
  try {
    const { story, name, beforeWeight, afterWeight, duration } = req.body;

    await Story.create({
      story,
      name: name || (req.session.user ? req.session.user.name : "Anonymous"),
      beforeWeight: beforeWeight ? Number(beforeWeight) : undefined,
      afterWeight: afterWeight ? Number(afterWeight) : undefined,
      duration: duration || "3 months",
      user: req.session.user ? (req.session.user._id || req.session.user.id) : null,
      isApproved: true
    });

    req.session.success = "Thank you for inspiring the community with your wellness journey! 🙌";
    res.redirect('/');
  } catch (err) {
    console.error('SHARE STORY ERROR:', err);
    req.session.error = "Failed to submit your story.";
    res.redirect('/share-story');
  }
});

module.exports = router;
