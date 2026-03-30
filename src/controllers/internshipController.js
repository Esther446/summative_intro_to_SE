const Internship = require('../models/Internship');

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
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.employer.toString() !== req.employer._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this internship' });
    }

    const updated = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Internship updated', internship: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/internships/:id
const deleteInternship = async (req, res, next) => {
  try {
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