import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', skills: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Convert comma-separated skills string into an array
      const skills = form.skills
        ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await api.post('/students/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        skills,
      });

      navigate('/student/login', { state: { message: 'Registered! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🎓</span>
          <h2>Student Registration</h2>
          <p>Create your account and start discovering internships.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Choose a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Skills <span className="hint">(comma-separated, e.g. React, Node.js)</span></label>
            <input
              type="text"
              name="skills"
              placeholder="React, Python, SQL..."
              value={form.skills}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/student/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
