const Internship = require('../models/Internship');
const mongoose = require('mongoose');

// POST /api/internships
const createInternship = async (req, res, next) => {
  try {
    const { title, description, location, requiredSkills } = req.body;

    const internship = new Internship({
      title,
      description,
      location,
      requiredSkills,
      employer: req.employer._id,
    });

    await internship.save();

    res.status(201).json({ message: 'Internship posted successfully', internship });
  } catch (error) {
    next(error);
  }
};

// GET /api/internships
const getAllInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find().populate('employer', 'companyName email');
    res.status(200).json(internships);
  } catch (error) {
    next(error);
  }
};

// GET /api/internships/:id
const getInternshipById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship id' });
    }

    const internship = await Internship.findById(req.params.id).populate('employer', 'companyName email');

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.status(200).json(internship);
  } catch (error) {
    next(error);
  }
};

// PUT /api/internships/:id
const updateInternship = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship id' });
    }

    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.employer.toString() !== req.employer._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this internship' });
    }

    const allowedFields = ['title', 'description', 'location', 'requiredSkills'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided to update' });
    }

    const updated = await Internship.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('employer', 'companyName email');

    res.status(200).json({ message: 'Internship updated', internship: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/internships/:id
const deleteInternship = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship id' });
    }

    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.employer.toString() !== req.employer._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this internship' });
    }

    await internship.deleteOne();

    res.status(200).json({ message: 'Internship deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
};