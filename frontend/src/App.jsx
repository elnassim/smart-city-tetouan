import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import Claims from './pages/Claims/Claims';
import Consumption from './pages/Consumption/Consumption';
import LandingPage from './pages/LandingPage';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import MeterManagement from './pages/Admin/MeterManagement';
import ClaimsManagement from './pages/Admin/ClaimsManagement';
import './App.css';

// Get the Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key. Please check your .env file.');
}

// Public route component - redirects to dashboard if signed in
function PublicRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div className="loading">Chargement...</div>;
  }
  
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Protected route component - redirects to landing page if not signed in
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div className="loading">Chargement...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/claims" element={
              <ProtectedRoute>
                <Claims />
              </ProtectedRoute>
            } />
            
            <Route path="/consumption" element={
              <ProtectedRoute>
                <Consumption />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            } />

            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              </ProtectedRoute>
            } />

            <Route path="/admin/meters" element={
              <ProtectedRoute>
                <AdminRoute>
                  <MeterManagement />
                </AdminRoute>
              </ProtectedRoute>
            } />

            <Route path="/admin/claims" element={
              <ProtectedRoute>
                <AdminRoute>
                  <ClaimsManagement />
                </AdminRoute>
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  );
}

// Header with UserButton
function Header() {
  const { user } = useUser();
  
  return (
    <header className="header">
      <div className="logo">
        <h1>Smart City Tétouan - Eau & Électricité</h1>
      </div>
      <div className="user-info">
        <SignedIn>
          <span>Bonjour, {user?.firstName}</span>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
        <SignedOut>
          <a href="/sign-in">Se connecter</a>
        </SignedOut>
      </div>
    </header>
  )
}

export default App
