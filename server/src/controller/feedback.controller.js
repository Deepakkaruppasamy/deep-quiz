const express = require('express');
const router = express.Router();
const Feedback = require('../model/feedback.model');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, rating, feedback } = req.body;
    const fb = new Feedback({ name, email, subject, rating, feedback });
    await fb.save();
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 