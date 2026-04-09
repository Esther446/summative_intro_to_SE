import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { setToken, setUser } from '../services/auth';

export default function StudentLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.message;

  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await api.post('/students/login', form);
      const { token } = res.data;

      // Decode the token payload to get user info (base64 middle part)
      const payload = JSON.parse(atob(token.split('.')[1]));

      setToken(token);
      setUser({ role: 'student', id: payload.id, name: form.email });

      navigate('/internships');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🎓</span>
          <h2>Student Login</h2>
          <p>Welcome back! Log in to continue exploring internships.</p>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/student/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
