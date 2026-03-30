const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,       // No duplicate emails in MongoDB
      lowercase: true,    // Normalize before saving
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,      // Never returned by MongoDB unless explicitly requested
    },
    internships: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Internship',
      default: [],        // Prevents undefined bugs
    },
  },
  {
    timestamps: true,     // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Employer', employerSchema);

