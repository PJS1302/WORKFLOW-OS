import { useFetch } from '../hooks/useFetch';
import { Table, Card, Button, Alert } from 'react-bootstrap';
import { getStatusBadge, formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';

const MyRequests = () => {
  const { data: requests, loading, error } = useFetch('/requests');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">My Requests</h1>
        <Link to="/submit-request"><Button variant="primary">New Request</Button></Link>
      </div>
      
      <Card className="shadow">
        <Card.Body>
          {loading ? <p>Loading...</p> : error ? <Alert variant="danger">{error}</Alert> : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests?.map(req => (
                  <tr key={req._id}>
                    <td>{req.title}</td>
                    <td>{req.type}</td>
                    <td>{getStatusBadge(req.status)}</td>
                    <td>{formatDate(req.createdAt)}</td>
                    <td><Button variant="info" size="sm">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default MyRequests;