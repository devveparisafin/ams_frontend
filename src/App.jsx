import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';

// Pages to be created
import Login from './pages/Login';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import BranchesManagement from './pages/admin/BranchesManagement';
import StaffManagement from './pages/admin/StaffManagement';
import Reports from './pages/admin/Reports';

import StaffDashboard from './pages/staff/StaffDashboard';
import History from './pages/staff/History';

function App() {
  const { initializeAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        {/* Admin Routes - Both Super Admin and Branch Admin */}
        <Route path="/admin" element={
          isAuthenticated && (user?.role === 'SUPER_ADMIN' || user?.role === 'BRANCH_ADMIN') 
            ? <AdminLayout /> 
            : <Navigate to="/login" />
        }>
          <Route index element={<SuperAdminDashboard />} />
          {user?.role === 'SUPER_ADMIN' && <Route path="branches" element={<BranchesManagement />} />}
          <Route path="staff" element={<StaffManagement />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={
          isAuthenticated && user?.role === 'STAFF' 
            ? <StaffLayout /> 
            : <Navigate to="/login" />
        }>
          <Route index element={<StaffDashboard />} />
          <Route path="history" element={<History />} />
        </Route>

        {/* Root Redirect based on Role */}
        <Route path="/" element={
          !isAuthenticated ? <Navigate to="/login" /> :
          user?.role === 'STAFF' ? <Navigate to="/staff" /> :
          <Navigate to="/admin" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
