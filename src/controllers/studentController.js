const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const generateToken = require('../utils/token');

// @desc    Register a new student
// @route   POST /api/students/register
const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, skills = [], interests = [] } = req.body;
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
      skills,
      interests,
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
        interests: student.interests,
        savedOpportunities: student.savedOpportunities,
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
        interests: student.interests,
        savedOpportunities: student.savedOpportunities,
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
        interests: student.interests,
        savedOpportunities: student.savedOpportunities,
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in student profile
// @route   PUT /api/students/profile
// @access  Protected (student)
const updateStudentProfile = async (req, res, next) => {
  try {
    const student = req.student;
    const { name, skills, interests } = req.body;

    if (name !== undefined) {
      student.name = name;
    }
    if (Array.isArray(skills)) {
      student.skills = skills;
    }
    if (Array.isArray(interests)) {
      student.interests = interests;
    }

    await student.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: student._id,
        role: 'student',
        name: student.name,
        email: student.email,
        skills: student.skills,
        interests: student.interests,
        savedOpportunities: student.savedOpportunities,
      },
    });
  } catch (error) {
    next(error);
  }
};

const buildRecommendedQuery = (skills) => {
  if (!skills || skills.length === 0) {
    return { _id: { $exists: false } };
  }
  return {
    requiredSkills: {
      $in: skills,
    },
  };
};

// @desc    Student dashboard data
// @route   GET /api/students/dashboard
// @access  Protected (student)
const getStudentDashboard = async (req, res, next) => {
  try {
    const student = await Student.findById(req.student._id)
      .populate({
        path: 'savedOpportunities',
        populate: { path: 'employer', select: 'companyName email' },
      });

    const recommended = await Internship.find(buildRecommendedQuery(student.skills))
      .populate('employer', 'companyName email')
      .limit(12);

    res.status(200).json({
      user: {
        id: student._id,
        role: 'student',
        name: student.name,
        email: student.email,
        skills: student.skills,
        interests: student.interests,
        savedOpportunities: student.savedOpportunities,
      },
      savedOpportunities: student.savedOpportunities,
      recommendedOpportunities: recommended,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  registerStudent,
  loginStudent,
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
};