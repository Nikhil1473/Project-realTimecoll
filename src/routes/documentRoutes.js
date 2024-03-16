const express = require('express');
const router = express.Router();
const passport = require('passport');
const Document = require('../models/Document');

// Create a new document
router.post('/documents', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title, content } = req.body;
  try {
    const newDocument = new Document({
      title,
      content,
      owner: req.user._id,
      collaborators: [req.user._id],
    });
    await newDocument.save();
    res.json(newDocument);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all documents
router.get('/documents', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
    });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

