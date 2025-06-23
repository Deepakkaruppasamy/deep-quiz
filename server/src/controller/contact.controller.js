const express = require('express');
const router = express.Router();
const Contact = require('../model/contact.model');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.status(201).json({ message: 'Contact message submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 