const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],  // Only valid values allowed
      default: 'pending',
    },
  },
  {
    timestamps: true,  // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Application', applicationSchema);
