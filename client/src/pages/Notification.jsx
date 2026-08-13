import { useNotifications } from '../context/NotificationContext';
import { Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { formatDate } from '../utils/formatters';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Notifications</h1>
        {notifications.length > 0 && <Button variant="secondary" onClick={markAllAsRead}>Mark All Read</Button>}
      </div>

      <Card className="shadow">
        <Card.Body>
          {notifications.length === 0 ? (
            <p className="text-center text-muted">No notifications found.</p>
          ) : (
            <ListGroup variant="flush">
              {notifications.map(n => (
                <ListGroup.Item key={n._id} className={`d-flex justify-content-between align-items-center ${!n.isRead ? 'bg-light' : ''}`}>
                  <div>
                    <p className="mb-1">{n.message} {!n.isRead && <Badge bg="primary">New</Badge>}</p>
                    <small className="text-muted">{formatDate(n.createdAt)}</small>
                  </div>
                  {!n.isRead && <Button variant="outline-primary" size="sm" onClick={() => markAsRead(n._id)}>Mark as Read</Button>}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Notifications;