import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Table, Card, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import api from '../services/api';

const UserManagement = () => {
  const { data: users, loading, error, setData } = useFetch('/users');
  const { data: departments } = useFetch('/departments');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'employee', position: '', department: '' });
  const [err, setErr] = useState('');

  const openEdit = (user) => {
    setEditUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, position: user.position, department: user.department?._id || '' });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditUser(null);
    setFormData({ name: '', email: '', role: 'employee', position: '', department: '', password: 'password123' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      // Avoid sending an empty string for department (fails ObjectId casting) -
      // send null instead so "No Department" properly clears it.
      const payload = { ...formData, department: formData.department || null };
      if (editUser) {
        const res = await api.put(`/users/${editUser._id}`, payload);
        setData(users.map(u => u._id === editUser._id ? res.data.data : u));
      } else {
        const res = await api.post('/users', payload);
        setData([...users, res.data.data]);
      }
      setShowModal(false);
    } catch (err) {
      setErr(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/users/${id}`);
      setData(users.filter(u => u._id !== id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">User Management</h1>
        <Button variant="primary" onClick={openCreate}>Add User</Button>
      </div>
      
      <Card className="shadow">
        <Card.Body>
          {loading ? <p>Loading...</p> : error ? <Alert variant="danger">{error}</Alert> : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><Badge bg="info">{user.role}</Badge></td>
                    <td>{user.position}</td>
                    <td>{user.department?.name || 'N/A'}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => openEdit(user)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editUser ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {err && <Alert variant="danger">{err}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Role</Form.Label><Form.Select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}><option value="employee">Employee</option><option value="manager">Manager</option><option value="admin">Admin</option></Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Position</Form.Label><Form.Control type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                <option value="">No Department</option>
                {departments?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagement;