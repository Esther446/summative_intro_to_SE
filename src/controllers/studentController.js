const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const generateToken = require('../utils/token');

// @desc    Register a new student
// @route   POST /api/students/register
const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, skills } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    const existingStudent = await Student.findOne({ email: normalizedEmail });
    if (existingStudent) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const student = new Student({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      skills
    });

    await student.save();

    res.status(201).json({
      message: 'Student registered successfully',
      token: generateToken(student, 'student'),
      user: {
        id: student._id,
        role: 'student',
        name: student.name,
        email: student.email,
        skills: student.skills,
      }
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
    const normalizedEmail = String(email || '').toLowerCase().trim();

    const student = await Student.findOne({ email: normalizedEmail }).select('+password');

    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(student, 'student'),
      user: {
        id: student._id,
        role: 'student',
        name: student.name,
        email: student.email,
        skills: student.skills,
      }
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
    const student = req.student;

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      user: {
        id: student._id,
        role: 'student',
        name: student.name,
        email: student.email,
        skills: student.skills,
      }
    });

  } catch (error) {
    next(error);
  }
};


module.exports = { registerStudent, loginStudent, getStudentProfile };