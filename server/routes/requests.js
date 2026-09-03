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

router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat, radius } = req.query;
    const requests = await Request.find({
      status: 'pending',
      pickup: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000
        }
      }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;