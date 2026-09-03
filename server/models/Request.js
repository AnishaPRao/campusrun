const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  item: String,
  pickup: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  drop: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  urgency: { type: Number, default: 1 },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

requestSchema.index({ pickup: '2dsphere' });

module.exports = mongoose.model('Request', requestSchema);