const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// @desc    Register a new student
// @route   POST /api/students/register
const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, skills } = req.body;

    // 1. Generate salt
    const salt = await bcrypt.genSalt(10);

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save student with hashed password
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      skills
    });

    await student.save();

    // Password not returned because schema has select: false
    res.status(201).json({
      message: 'Student registered successfully',
      student
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Login student
// @route   POST /api/students/login
const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find student and include password explicitly
    const student = await Student.findOne({ email }).select('+password');

    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Create token
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Get logged-in student profile
// @route   GET /api/students/profile
// @access  Protected
const getStudentProfile = async (req, res, next) => {
  try {
    // req.student is attached by protectStudent middleware
    const student = req.student;

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove password from response
    student.password = undefined;

    res.status(200).json({ student });

  } catch (error) {
    next(error);
  }
};


module.exports = { registerStudent, loginStudent, getStudentProfile };