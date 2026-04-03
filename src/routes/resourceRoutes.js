const express = require('express');
const router = express.Router();

const { getResources, createResource } = require('../controllers/resourceController');
const { protectAdmin } = require('../middleware/auth');

router.get('/', getResources);
router.post('/', protectAdmin, createResource);

module.exports = router;
