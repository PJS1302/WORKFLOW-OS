import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch initial notifications
      api.get('/notifications').then(res => setNotifications(res.data.data));

      // Setup socket
      const newSocket = io('/', { transports: ['websocket'] });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('join', user.id);
      });

      newSocket.on('newNotification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });

      return () => newSocket.close();
    }
  }, [isAuthenticated, user]);

  const markAsRead = async (id) => {
    await api.put(`/notifications/${id}`);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    await api.put('/notifications');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);