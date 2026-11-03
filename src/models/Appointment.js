const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dietician: { type: mongoose.Schema.Types.ObjectId, ref: 'Dietician', required: true },
  date: { type: Date, required: true },
  mode: { type: String, enum: ['online', 'offline', 'in-person'], default: 'online' },
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' },
  cancelReason: { type: String },
  lastReminderAt: { type: Date },
  paymentConfirmed: { type: Boolean, default: false },
  amount: { type: Number, default: 0 },
  paymentId: { type: String },
  meetingLink: { type: String },
  notes: { type: String, default: '' },
  dieticianNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
