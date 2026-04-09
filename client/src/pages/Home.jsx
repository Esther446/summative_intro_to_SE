import { Link } from 'react-router-dom';
import { isLoggedIn, isStudent, isEmployer } from '../services/auth';

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Find Your Perfect Internship</h1>
        <p>SkillMatch connects talented students with companies looking for fresh talent.</p>

        {!isLoggedIn() && (
          <div className="hero-actions">
            <div className="hero-card">
              <span className="hero-icon">🎓</span>
              <h3>I'm a Student</h3>
              <p>Discover internships that match your skills and apply in seconds.</p>
              <div className="hero-btns">
                <Link to="/student/register" className="btn btn-primary">Register</Link>
                <Link to="/student/login" className="btn btn-outline">Login</Link>
              </div>
            </div>
            <div className="hero-card">
              <span className="hero-icon">🏢</span>
              <h3>I'm an Employer</h3>
              <p>Post internship opportunities and find motivated candidates.</p>
              <div className="hero-btns">
                <Link to="/employer/register" className="btn btn-primary">Register</Link>
                <Link to="/employer/login" className="btn btn-outline">Login</Link>
              </div>
            </div>
          </div>
        )}

        {isStudent() && (
          <div className="logged-in-cta">
            <Link to="/internships" className="btn btn-primary btn-lg">Browse Internships →</Link>
          </div>
        )}

        {isEmployer() && (
          <div className="logged-in-cta">
            <Link to="/post-internship" className="btn btn-primary btn-lg">Post an Internship →</Link>
            <Link to="/internships" className="btn btn-outline btn-lg">View All Internships</Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature-card">
          <span>🔍</span>
          <h4>Smart Matching</h4>
          <p>Browse internships tailored to your skill set.</p>
        </div>
        <div className="feature-card">
          <span>⚡</span>
          <h4>One-Click Apply</h4>
          <p>Apply to any internship instantly — no lengthy forms.</p>
        </div>
        <div className="feature-card">
          <span>📊</span>
          <h4>Track Applications</h4>
          <p>See the status of every application you've submitted.</p>
        </div>
      </div>
    </div>
  );
}
