import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Journey from '../pages/Journey';
import Guidelines from '../pages/Guidelines';
import Prizes from '../pages/Prizes';
import Leaderboard from '../pages/Leaderboard';
import Innovations from '../pages/Innovations';

// Auth Pages
import Login from '../pages/auth/Login';
import RegisterSchool from '../pages/auth/RegisterSchool';
import RegisterEvaluator from '../pages/auth/RegisterEvaluator';

// Dashboards
import SchoolDashboard from '../pages/dashboard/SchoolDashboard';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import EvaluatorDashboard from '../pages/dashboard/EvaluatorDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';

// Guard & Errors
import ProtectedRoute from '../components/auth/ProtectedRoute';
import NotFound from '../pages/NotFound';
import Forbidden from '../pages/Forbidden';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Navigation */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/journey" element={<Journey />} />
      <Route path="/guidelines" element={<Guidelines />} />
      <Route path="/prizes" element={<Prizes />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/innovations" element={<Innovations />} />

      {/* Authentication */}
      <Route path="/login" element={<Navigate to="/login/student" replace />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/register/school" element={<RegisterSchool />} />
      <Route path="/register/evaluator" element={<RegisterEvaluator />} />

      {/* Protected Role Dashboards */}
      <Route
        path="/school/dashboard"
        element={
          <ProtectedRoute allowedRoles={['school', 'admin']}>
            <SchoolDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluator/dashboard"
        element={
          <ProtectedRoute allowedRoles={['evaluator', 'admin']}>
            <EvaluatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
