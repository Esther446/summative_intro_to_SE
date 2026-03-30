const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Employer = require('../models/Employer');

const protectStudent = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = await Student.findById(decoded.id);

    if (!req.student) {
      return res.status(401).json({ message: 'Student not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};


const protectEmployer = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const employer = await Employer.findById(decoded.id);

    if (!employer) {
      return res.status(401).json({ message: 'Employer not found' });
    }

    req.employer = employer;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token failed' });
  }
};

module.exports = { protectStudent, protectEmployer };