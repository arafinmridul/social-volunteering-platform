const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  skills: { type: [String], default: [] }, // Array of skills
  interests: { type: [String], default: [] }, // Array of interests
  bio: { type: String, default: '' }, // Bio field
  eventHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Events the user has joined
}, { timestamps: true });

// Hash the password before saving to DB with pre-save middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to add an event to the user's history
userSchema.methods.joinEvent = async function (eventId) {
  if (!this.eventHistory.includes(eventId)) {
    this.eventHistory.push(eventId);
    await this.save();
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
