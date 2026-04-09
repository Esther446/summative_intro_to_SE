import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function PostInternship() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    requiredSkills: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const skills = form.requiredSkills
        ? form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      // employer ID is taken from the JWT token on the backend (req.employer._id)
      await api.post('/internships', {
        title: form.title,
        description: form.description,
        location: form.location,
        requiredSkills: skills,
      });

      setSuccess('✅ Internship posted successfully!');
      setForm({ title: '', description: '', location: '', requiredSkills: '' });

      setTimeout(() => navigate('/internships'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post internship. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <span className="auth-icon">📋</span>
          <h2>Post an Internship</h2>
          <p>Fill in the details to attract the right candidates.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Frontend Developer Intern"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe the role, responsibilities, and what the intern will learn..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Remote, Cape Town, Johannesburg"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Required Skills <span className="hint">(comma-separated)</span></label>
            <input
              type="text"
              name="requiredSkills"
              placeholder="React, Node.js, MongoDB..."
              value={form.requiredSkills}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Posting...' : 'Post Internship'}
          </button>
        </form>
      </div>
    </div>
  );
}

