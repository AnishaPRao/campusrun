const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

router.post('/', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;