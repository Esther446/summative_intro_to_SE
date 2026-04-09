import { useState, useEffect } from 'react';
import api from '../services/api';
import { isStudent, getUser } from '../services/auth';

export default function InternshipList() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Track which internship is being applied to, and messages per card
  const [applying, setApplying] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.get('/internships');
        setInternships(res.data);
      } catch (err) {
        setError('Failed to load internships. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const handleApply = async (internshipId) => {
    const user = getUser();
    if (!user) return;

    setApplying(internshipId);
    setMessages((prev) => ({ ...prev, [internshipId]: null }));

    try {
      await api.post('/applications', {
        student: user.id,
        internship: internshipId,
      });
      setMessages((prev) => ({
        ...prev,
        [internshipId]: { type: 'success', text: '✅ Application submitted successfully!' },
      }));
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [internshipId]: {
          type: 'error',
          text: err.response?.data?.message || '❌ Failed to apply. Please try again.',
        },
      }));
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <div className="page-center"><div className="spinner" /></div>;
  if (error) return <div className="page-center"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>Available Internships</h1>
        <p>{internships.length} opportunity{internships.length !== 1 ? 'ies' : 'y'} found</p>
      </div>

      {internships.length === 0 ? (
        <div className="empty-state">
          <span>📭</span>
          <p>No internships posted yet. Check back soon!</p>
        </div>
      ) : (
        <div className="internship-grid">
          {internships.map((item) => (
            <div key={item._id} className="internship-card">
              <div className="internship-card-header">
                <h3>{item.title}</h3>
                <span className="location-badge">📍 {item.location}</span>
              </div>

              <p className="internship-desc">{item.description}</p>

              {item.requiredSkills?.length > 0 && (
                <div className="skills-list">
                  {item.requiredSkills.map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}

              {item.employer && (
                <p className="employer-name">
                  🏢 {item.employer.companyName || 'Company'}
                </p>
              )}

              {/* Only students see the Apply button */}
              {isStudent() && (
                <div className="card-actions">
                  {messages[item._id] && (
                    <div className={`alert alert-${messages[item._id].type}`}>
                      {messages[item._id].text}
                    </div>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApply(item._id)}
                    disabled={applying === item._id || messages[item._id]?.type === 'success'}
                  >
                    {applying === item._id
                      ? 'Applying...'
                      : messages[item._id]?.type === 'success'
                      ? 'Applied ✓'
                      : 'Apply Now'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
