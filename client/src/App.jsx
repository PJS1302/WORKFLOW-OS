import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import RequestSubmission from './pages/RequestSubmission';
import MyRequests from './pages/MyRequests';
import PendingApprovals from './pages/PendingApprovals';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import WorkflowManagement from './pages/WorkflowManagement';
import WorkflowTemplates from './pages/WorkflowTemplates';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notification';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<NotificationProvider><MainLayout /></NotificationProvider>}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Employee & general routes */}
          <Route path="/submit-request" element={<RequestSubmission />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Manager & Admin Routes */}
          <Route element={<ProtectedRoute roles={['manager', 'admin']} />}>
            <Route path="/pending-approvals" element={<PendingApprovals />} />
          </Route>

          {/* Admin Specific Routes */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/departments" element={<DepartmentManagement />} />
            <Route path="/admin/workflows" element={<WorkflowManagement />} />
            <Route path="/admin/workflow-templates" element={<WorkflowTemplates />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}