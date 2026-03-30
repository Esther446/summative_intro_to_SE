const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employer = require('../models/Employer');

// @desc    Register a new employer
// @route   POST /api/employers/register
const registerEmployer = async (req, res, next) => {
  try {
    const { companyName, email, password } = req.body;

    // 1. Generate salt
    const salt = await bcrypt.genSalt(10);

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save employer with hashed password
    const employer = new Employer({
      companyName,
      email,
      password: hashedPassword
    });

    await employer.save();

    // Password is never returned — schema has select: false on password field
    res.status(201).json({
      message: 'Employer registered successfully',
      employer
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Login employer
// @route   POST /api/employers/login
const loginEmployer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find employer and include password explicitly
    const employer = await Employer.findOne({ email }).select('+password');

    if (!employer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, employer.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Create token
    const token = jwt.sign(
      { id: employer._id, role: 'employer' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { registerEmployer, loginEmployer };