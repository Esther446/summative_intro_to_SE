import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, isStudent, isEmployer, getUser, logout } from '../services/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
    // Force re-render by reloading
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">⚡ SkillMatch</Link>
      </div>

      <ul className="navbar-links">
        {/* Always visible */}
        <li><Link to="/internships">Browse Internships</Link></li>

        {/* Not logged in */}
        {!isLoggedIn() && (
          <>
            <li className="dropdown">
              <span className="dropdown-toggle">Student ▾</span>
              <ul className="dropdown-menu">
                <li><Link to="/student/register">Register</Link></li>
                <li><Link to="/student/login">Login</Link></li>
              </ul>
            </li>
            <li className="dropdown">
              <span className="dropdown-toggle">Employer ▾</span>
              <ul className="dropdown-menu">
                <li><Link to="/employer/register">Register</Link></li>
                <li><Link to="/employer/login">Login</Link></li>
              </ul>
            </li>
          </>
        )}

        {/* Employer only */}
        {isEmployer() && (
          <li><Link to="/post-internship" className="btn-accent">Post Internship</Link></li>
        )}

        {/* Logged in — show user info + logout */}
        {isLoggedIn() && (
          <>
            <li className="user-badge">
              {isStudent() ? '🎓' : '🏢'} {user?.name || user?.companyName}
            </li>
            <li>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
