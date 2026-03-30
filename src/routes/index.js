const express = require('express');

const router = express.Router();

// @route   GET /api/health
// @desc    Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillMatch API is running' });
});

module.exports = router;
