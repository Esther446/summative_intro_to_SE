// Validate student registration request
const validateStudent = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  next();
};

// Validate employer registration request
const validateEmployer = (req, res, next) => {
  const { companyName, email, password } = req.body;

  if (!companyName || !email || !password) {
    return res.status(400).json({ message: 'companyName, email, and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  next();
};

// Validate internship creation request
const validateInternship = (req, res, next) => {
  const { title, description, location } = req.body;

  if (!title || !description || !location) {
    return res.status(400).json({
      message: 'title, description, and location are required'
    });
  }

  next();
};

// Validate application creation request
function validateApplication(req, res, next) {
  const { internship } = req.body;

  if (!internship) {
    return res.status(400).json({ message: 'internship ID is required' });
  }

  next();
}

module.exports = {
  validateStudent,
  validateEmployer,
  validateLogin,
  validateInternship,
  validateApplication,
};
