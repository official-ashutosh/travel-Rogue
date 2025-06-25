import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Header from './components/Header.jsx';
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/community-plans" element={<CommunityPlansPage />} />
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
        <Route 
          path="/dashboard" 
          element={user ? (user.role === 'admin' ? <Navigate to="/admin" replace /> : <DashboardPage />) : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/plans/new" 
          element={user?.role === 'user' ? <NewPlanPage /> : user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/plans/:planId/edit" 
          element={user?.role === 'user' ? <NewPlanPage isEdit={true} /> : user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />} 
        />        
        <Route 
          path="/plans/:planId" 
          element={user ? (user.role === 'admin' ? <Navigate to="/admin" replace /> : <PlanDetailPage />) : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/plans/:planId/community-plan" 
          element={<PlanDetailPage isPublic={true} />} 
        />
        <Route 
          path="/expenses" 
          element={user?.role === 'user' ? <ExpensesPage /> : user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/plans/:planId/expenses" 
          element={user?.role === 'user' ? <ExpensesPage /> : user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/payments" 
          element={user?.role === 'user' ? <PaymentsPage /> : user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/feedback" 
          element={user?.role === 'user' ? <FeedbackPage /> : user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />} 
        />
        <Route path="/invite/:token" element={<InvitePage />} />
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
