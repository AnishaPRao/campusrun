const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { shouldBatch } = require('../utils/batching');

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

router.get('/batch-check', async (req, res) => {
  try {
    const { runnerLng, runnerLat, idA, idB } = req.query;
    const runnerLoc = [parseFloat(runnerLng), parseFloat(runnerLat)];

    const reqA = await Request.findById(idA);
    const reqB = await Request.findById(idB);

    if (!reqA || !reqB) {
      return res.status(404).json({ error: 'One or both requests not found' });
    }

    const result = shouldBatch(runnerLoc, reqA, reqB);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;