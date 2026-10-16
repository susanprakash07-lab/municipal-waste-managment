import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WasteSegregation from './pages/WasteSegregation';
import WasteCollection from './pages/WasteCollection';
import WasteProcessing from './pages/WasteProcessing';
import RecyclingPlant from './pages/RecyclingPlant';
import LandfillManagement from './pages/LandfillManagement';
import Reports from './pages/Reports';
import SearchRecords from './pages/SearchRecords';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Root Redirect to Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* Operational Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/segregation"
            element={
              <ProtectedRoute>
                <WasteSegregation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collection"
            element={
              <ProtectedRoute>
                <WasteCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/processing"
            element={
              <ProtectedRoute>
                <WasteProcessing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycling"
            element={
              <ProtectedRoute>
                <RecyclingPlant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landfills"
            element={
              <ProtectedRoute>
                <LandfillManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Admin Restricted Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
