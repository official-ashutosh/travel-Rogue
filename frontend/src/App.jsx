import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Header from './components/Header.jsx';

// Import pages
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PlanDetailPage from './pages/PlanDetailPage.jsx';
import NewPlanPage from './pages/NewPlanPage.jsx';
import CommunityPlansPage from './pages/CommunityPlansPage.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import ExpensesPage from './pages/ExpensesPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import InvitePage from './pages/InvitePage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/community-plans" element={<CommunityPlansPage />} />
        
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={user ? (user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={user ? (user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <SignupPage />} 
        />
        <Route 
          path="/forgot-password" 
          element={user ? (user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <ForgotPasswordPage />} 
        />
        <Route 
          path="/reset-password/:token" 
          element={user ? (user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : <ResetPasswordPage />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={user ? <DashboardPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/plans/new" 
          element={user ? <NewPlanPage /> : <Navigate to="/login" replace />} 
        />        
        <Route 
          path="/plans/:planId" 
          element={user ? <PlanDetailPage /> : <Navigate to="/login" replace />} 
        />
        
        {/* Community Plan Details Route */}
        <Route 
          path="/plans/:planId/community-plan" 
          element={<PlanDetailPage isPublic={true} />} 
        />
        
        {/* Expenses Routes */}
        <Route 
          path="/expenses" 
          element={user ? <ExpensesPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/plans/:planId/expenses" 
          element={user ? <ExpensesPage /> : <Navigate to="/login" replace />} 
        />
        
        {/* Other Protected Routes */}
        <Route 
          path="/payments" 
          element={user ? <PaymentsPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/feedback" 
          element={user ? <FeedbackPage /> : <Navigate to="/login" replace />} 
        />
        
        {/* Invite Routes */}
        <Route path="/invite/:token" element={<InvitePage />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
