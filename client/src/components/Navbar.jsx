import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { notifications, markAllAsRead } = useNotifications();
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="navbar navbar-top navbar-expand fixed-top mb-4">
      <div className="container-fluid">
        <button className="btn btn-link d-md-none" onClick={toggleSidebar}>
          <i className="bi bi-list"></i> ☰
        </button>
        
        <div className="ms-auto d-flex align-items-center">
          <div className="dropdown position-relative me-3">
            <button className="btn btn-light position-relative" onClick={() => setShowNotif(!showNotif)}>
              🔔
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="notification-dropdown mt-2">
                <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                  <h6 className="mb-0">Notifications</h6>
                  <button className="btn btn-sm btn-link" onClick={markAllAsRead}>Mark all read</button>
                </div>
                <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                  {notifications.length === 0 ? (
                    <p className="text-center text-muted p-3 mb-0">No notifications</p>
                  ) : (
                    notifications.slice(0, 5).map(n => (
                      <div key={n._id} className={`p-2 border-bottom ${!n.isRead ? 'bg-light' : ''}`}>
                        <small>{n.message}</small>
                        <br />
                        <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="dropdown">
            <button className="btn btn-light dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
              <div
                className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: '#6366f1',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {(user?.name || '?').charAt(0).toUpperCase()}
              </div>
              {user?.name}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><button className="dropdown-item" onClick={() => navigate('/profile')}>Profile</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;