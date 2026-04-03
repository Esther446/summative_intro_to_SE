const Internship = require('../models/Internship');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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

    const token = (req.headers.authorization || '').startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    let recommended = [];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'student') {
          const student = await Student.findById(decoded.userId);
          const studentSkills = student?.skills || [];

          if (studentSkills.length > 0) {
            recommended = internships.filter((internship) =>
              (internship.requiredSkills || []).some((skill) => studentSkills.includes(skill))
            );
          }
        }
      } catch (error) {
        // Ignore invalid token and still return public internships list
      }
    }

    res.status(200).json({ internships, recommended });
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

// POST /api/internships/:id/save
const saveInternship = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid internship id' });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    const student = req.student;
    const internshipId = internship._id.toString();
    const alreadySaved = student.savedOpportunities.some((id) => id.toString() === internshipId);

    if (alreadySaved) {
      return res.status(200).json({ message: 'Internship already saved', savedOpportunities: student.savedOpportunities });
    }

    student.savedOpportunities.push(internship._id);
    await student.save();

    res.status(200).json({
      message: 'Internship saved successfully',
      savedOpportunities: student.savedOpportunities,
    });
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
  saveInternship,
};