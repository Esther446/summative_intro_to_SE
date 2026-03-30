const Application = require('../models/Application');

// @desc    Submit an application
// @route   POST /api/applications
const createApplication = async (req, res, next) => {
  try {
    const { internship, status } = req.body;

    const application = new Application({
      student: req.student._id, // from auth middleware
      internship,
      status
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { createApplication };