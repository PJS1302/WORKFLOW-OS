import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

// Pages
import Login from '../pages/login';
import Register from '../pages/register';
import Dashboard from '../pages/dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ManagerDashboard from '../pages/ManagerDashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import UserManagement from '../pages/UserManagement';
import DepartmentManagement from '../pages/DepartmentManagement';
import WorkflowManagement from '../pages/WorkflowManagement';
import WorkflowTemplates from '../pages/WorkflowTemplates';
import RequestSubmission from '../pages/RequestSubmission';
import MyRequests from '../pages/MyRequests';
import PendingApprovals from '../pages/PendingApprovals';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Role Specific Dashboards */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/manager/dashboard" element={<ProtectedRoute roles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/employee/dashboard" element={<ProtectedRoute roles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />

          {/* Employee & Manager Routes */}
          <Route path="/submit-request" element={<ProtectedRoute roles={['employee', 'manager']}><RequestSubmission /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute roles={['employee', 'manager']}><MyRequests /></ProtectedRoute>} />
          <Route path="/pending-approvals" element={<ProtectedRoute roles={['manager', 'admin']}><PendingApprovals /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute roles={['admin']}><DepartmentManagement /></ProtectedRoute>} />
          <Route path="/admin/workflows" element={<ProtectedRoute roles={['admin']}><WorkflowManagement /></ProtectedRoute>} />
          <Route path="/admin/templates" element={<ProtectedRoute roles={['admin']}><WorkflowTemplates /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute roles={['admin', 'manager']}><Reports /></ProtectedRoute>} />

          {/* Common Routes */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;