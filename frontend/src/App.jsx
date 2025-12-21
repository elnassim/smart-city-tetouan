import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import Dashboard from './pages/Dashboard/Dashboard'
import Claims from './pages/Claims/Claims'
import Consumption from './pages/Consumption/Consumption'
import SignInPage from './pages/Auth/SignInPage'
import SignUpPage from './pages/Auth/SignUpPage'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
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
        </Routes>
      </div>
    </Router>
  )
}

// Protected route component
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" />
      </SignedOut>
    </>
  )
}

// Header with UserButton
function Header() {
  const { user } = useUser()
  
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
