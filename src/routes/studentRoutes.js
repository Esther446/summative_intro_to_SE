const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard
} = require('../controllers/studentController');
const { protectStudent } = require('../middleware/auth');
const { validateStudent, validateLogin } = require('../middleware/validate');

// @route   POST /api/students/register
router.post('/register', validateStudent, registerStudent);

// @route   POST /api/students/login
router.post('/login', validateLogin, loginStudent);

// @route   GET /api/students/profile  (protected)
router.get('/profile', protectStudent, getStudentProfile);
router.put('/profile', protectStudent, updateStudentProfile);
router.get('/dashboard', protectStudent, getStudentDashboard);

module.exports = router;
