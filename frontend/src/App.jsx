import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Header from './components/Header.jsx';

// Import pages
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PlanDetailPage from './pages/PlanDetailPage.jsx';
import NewPlanPage from './pages/NewPlanPage.jsx';
import CommunityPlansPage from './pages/CommunityPlansPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import ComponentDemo from './components/demo/ComponentDemo.jsx';
import IntegrationTest from './components/demo/IntegrationTest.jsx';

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
        <Route path="/demo" element={<ComponentDemo />} />
        <Route path="/test" element={<IntegrationTest />} />
        
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
        />
          {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={user ? <DashboardPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/plans" 
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/plans/new" 
          element={user ? <NewPlanPage /> : <Navigate to="/login" replace />} 
        />        
        <Route 
          path="/plans/:planId/plan" 
          element={user ? <PlanDetailPage /> : <Navigate to="/login" replace />} 
        />
        {/* Community Plan Details Route */}
        <Route 
          path="/plans/:planId/community-plan" 
          element={<PlanDetailPage isPublic={true} />} 
        />
        <Route 
          path="/plans/:planId" 
          element={user ? <PlanDetailPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/profile" 
          element={user ? <ProfilePage /> : <Navigate to="/login" replace />} 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
