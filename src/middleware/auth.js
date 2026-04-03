const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Employer = require('../models/Employer');

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return null;
  }
  return header.split(' ')[1];
};

const protectStudent = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing or invalid format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'student') {
      return res.status(403).json({ message: 'Student access required' });
    }

    req.student = await Student.findById(decoded.userId);

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
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing or invalid format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'employer') {
      return res.status(403).json({ message: 'Employer access required' });
    }

    const employer = await Employer.findById(decoded.userId);

    if (!employer) {
      return res.status(401).json({ message: 'Employer not found' });
    }

    req.employer = employer;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const protectAdmin = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing or invalid format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.admin = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protectStudent, protectEmployer, protectAdmin };