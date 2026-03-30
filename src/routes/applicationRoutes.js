const express = require('express');
const router = express.Router();
const { createApplication } = require('../controllers/applicationController');
const { protectStudent } = require('../middleware/auth');
const { validateApplication } = require('../middleware/validate');

// POST /api/applications — student must be logged in
router.post('/', protectStudent, validateApplication, createApplication);

module.exports = router;
