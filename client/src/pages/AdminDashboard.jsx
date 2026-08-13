import { useFetch } from '../hooks/useFetch';
import { Table } from 'react-bootstrap';

const AdminDashboard = () => {
  const { data: users, loading } = useFetch('/users?limit=5');

  return (
    <div>
      <h1 className="h3 mb-4 text-gray-800">Admin Dashboard</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Recent Users</h6>
        </div>
        <div className="card-body">
          {loading ? <p>Loading...</p> : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {users?.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="badge bg-info">{user.role}</span></td>
                    <td>{user.position}</td>
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

export default AdminDashboard;