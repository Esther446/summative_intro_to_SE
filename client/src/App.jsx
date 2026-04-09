import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import StudentRegister from './pages/StudentRegister';
import StudentLogin from './pages/StudentLogin';
import EmployerRegister from './pages/EmployerRegister';
import EmployerLogin from './pages/EmployerLogin';
import InternshipList from './pages/InternshipList';
import PostInternship from './pages/PostInternship';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/employer/register" element={<EmployerRegister />} />
          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route path="/internships" element={<InternshipList />} />

          {/* Protected: employer only */}
          <Route
            path="/post-internship"
            element={
              <ProtectedRoute role="employer">
                <PostInternship />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
