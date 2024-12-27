const mongoose = require('mongoose');

// Define the session schema
const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  lastLogin: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// Create the session model
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
