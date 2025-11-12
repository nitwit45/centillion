import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

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

// Dashboard Pages
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ProfilePage from './pages/ProfilePage';
import DocumentsPage from './pages/DocumentsPage';
import TreatmentFormPage from './pages/TreatmentFormPage';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

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
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* Protected Dashboard Routes */}
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
