const express = require('express');
const router = express.Router();

const {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship
} = require('../controllers/internshipController');

const { validateInternship } = require('../middleware/validate');
const { protectEmployer } = require('../middleware/auth');


// GET /api/internships — public
router.get('/', getAllInternships);

// GET /api/internships/:id — public
router.get('/:id', getInternshipById);

// POST /api/internships — employer must be authenticated
router.post('/', protectEmployer, validateInternship, createInternship);

// PUT /api/internships/:id — employer only
router.put('/:id', protectEmployer, updateInternship);

// DELETE /api/internships/:id — employer only
router.delete('/:id', protectEmployer, deleteInternship);

module.exports = router;