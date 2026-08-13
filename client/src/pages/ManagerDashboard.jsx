import { useFetch } from '../hooks/useFetch';
import { getStatusBadge, formatDate } from '../utils/formatters';
import { Table } from 'react-bootstrap';

const ManagerDashboard = () => {
  const { data: requests, loading } = useFetch('/requests?limit=5');

  return (
    <div>
      <h1 className="h3 mb-4 text-gray-800">Manager Dashboard</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Latest Pending Approvals</h6>
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

export default ManagerDashboard;