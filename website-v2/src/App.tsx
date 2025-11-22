import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';

// Layout Components
import NavbarNew from './components/layout/NavbarNew';
import FooterNew from './components/layout/FooterNew';

// Section Components
import HeroNew from './components/sections/HeroNew';
import AboutNew from './components/sections/AboutNew';
import ServicesNew from './components/sections/ServicesNew';
import DestinationsNew from './components/sections/DestinationsNew';
import TeamNew from './components/sections/TeamNew';
import ContactNew from './components/sections/ContactNew';

// Auth Pages
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';

// Dashboard Pages
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ProfilePage from './pages/ProfilePage';
import DocumentsPage from './pages/DocumentsPage';
import TreatmentFormPage from './pages/TreatmentFormPage';

// Admin Pages
import AdminLayout from './pages/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminFormsPage from './pages/AdminFormsPage';
import AdminDocumentsPage from './pages/AdminDocumentsPage';

// Protected Routes
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="App">
      <NavbarNew />
      <HeroNew />
      <AboutNew />
      <ServicesNew />
      <DestinationsNew />
      <TeamNew />
      <ContactNew />
      <FooterNew />
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Centillion Gateway
            </span>
          </h1>
          <div className="mx-auto h-1 w-64 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

            {/* Protected User Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="treatment-form" element={<TreatmentFormPage />} />
          </Route>

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="forms" element={<AdminFormsPage />} />
              <Route path="documents" element={<AdminDocumentsPage />} />
            </Route>
        </Routes>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
