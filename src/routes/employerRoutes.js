const express = require('express');
const router = express.Router();
const { registerEmployer, loginEmployer } = require('../controllers/employerController');
const { validateEmployer, validateLogin } = require('../middleware/validate');

// POST /api/employers/register
router.post('/register', validateEmployer, registerEmployer);

// POST /api/employers/login
router.post('/login', validateLogin, loginEmployer);

module.exports = router;
