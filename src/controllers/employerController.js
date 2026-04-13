const bcrypt = require('bcrypt');
const Employer = require('../models/Employer');
const generateToken = require('../utils/token');

// @desc    Register a new employer
// @route   POST /api/employers/register
const registerEmployer = async (req, res, next) => {
  try {
    const { companyName, email, password } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({ message: 'companyName, email, and password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = String(email || '').toLowerCase().trim();

    const existingEmployer = await Employer.findOne({ email: normalizedEmail });
    if (existingEmployer) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employer = new Employer({
      companyName,
      email: normalizedEmail,
      password: hashedPassword
    });

    await employer.save();

    const token = generateToken(employer, 'employer');

    return res.status(201).json({
      token,
      role: 'employer',
      user: {
        id: employer._id,
        role: 'employer',
        companyName: employer.companyName,
        email: employer.email,
      }
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
    const normalizedEmail = String(email || '').toLowerCase().trim();

    const employer = await Employer.findOne({ email: normalizedEmail }).select('+password');

    if (!employer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, employer.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(employer, 'employer'),
      user: {
        id: employer._id,
        role: 'employer',
        companyName: employer.companyName,
        email: employer.email,
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { registerEmployer, loginEmployer };