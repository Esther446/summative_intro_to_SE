const Resource = require('../models/Resource');

// GET /api/resources
const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
};

// POST /api/resources
const createResource = async (req, res, next) => {
  try {
    const { title, type, link, skills = [] } = req.body;

    const resource = await Resource.create({
      title,
      type,
      link,
      skills,
    });

    res.status(201).json({ message: 'Resource created successfully', resource });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResources, createResource };
