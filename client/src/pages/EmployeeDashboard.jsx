import { useFetch } from '../hooks/useFetch';
import { getStatusBadge, formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';

const EmployeeDashboard = () => {
  const { data: requests, loading } = useFetch('/requests?limit=5');

  return (
    <div>
      <h1 className="h3 mb-4 text-gray-800">Employee Dashboard</h1>
      <div className="d-grid gap-2 mb-4">
        <Link to="/submit-request">
          <Button variant="primary" size="lg">Submit New Request</Button>
        </Link>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">My Recent Requests</h6>
        </div>
        <div className="card-body">
          {loading ? <p>Loading...</p> : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests?.map(req => (
                  <tr key={req._id}>
                    <td>{req.title}</td>
                    <td>{req.type}</td>
                    <td>{getStatusBadge(req.status)}</td>
                    <td>{formatDate(req.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;