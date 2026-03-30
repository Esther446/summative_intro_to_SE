const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, getStudentProfile } = require('../controllers/studentController');
const { protectStudent } = require('../middleware/auth');
const { validateStudent } = require('../middleware/validate');

// @route   POST /api/students/register
router.post('/register', validateStudent, registerStudent);

// @route   POST /api/students/login
router.post('/login', loginStudent);

// @route   GET /api/students/profile  (protected)
router.get('/profile', protectStudent, getStudentProfile);

module.exports = router;
