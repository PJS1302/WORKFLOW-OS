import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const linkClass = (path) => `sidebar-link ${location.pathname === path ? 'active' : ''}`;

  return (
    <div className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center justify-content-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center fw-bold text-white"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              fontSize: '1rem',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            W
          </div>
          <h4 className="text-light mb-0">Workflow OS</h4>
        </div>
        <small className="text-muted d-block text-center mt-1">{user?.role?.toUpperCase()}</small>
      </div>
      <nav className="mt-3">
        <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
        
        {user?.role === 'employee' && (
          <>
            <Link to="/submit-request" className={linkClass('/submit-request')}>Submit Request</Link>
            <Link to="/my-requests" className={linkClass('/my-requests')}>My Requests</Link>
          </>
        )}

        {user?.role === 'manager' && (
          <>
            <Link to="/pending-approvals" className={linkClass('/pending-approvals')}>Pending Approvals</Link>
            <Link to="/my-requests" className={linkClass('/my-requests')}>My Requests</Link>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <Link to="/admin/users" className={linkClass('/admin/users')}>User Management</Link>
            <Link to="/admin/departments" className={linkClass('/admin/departments')}>Departments</Link>
            <Link to="/admin/workflow-templates" className={linkClass('/admin/workflow-templates')}>Workflow Templates</Link>
            <Link to="/admin/workflows" className={linkClass('/admin/workflows')}>Workflows</Link>
            <Link to="/admin/reports" className={linkClass('/admin/reports')}>Reports</Link>
          </>
        )}
        
        <Link to="/profile" className={linkClass('/profile')}>Profile</Link>
        <Link to="/settings" className={linkClass('/settings')}>Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;