import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Table, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../services/api';

const DepartmentManagement = () => {
  const { data: departments, loading, error, setData } = useFetch('/departments');
  const { data: users } = useFetch('/users');
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', head: '' });
  const [err, setErr] = useState('');

  const openEdit = (dept) => {
    setEditDept(dept);
    setFormData({ name: dept.name, description: dept.description, head: dept.head?._id || '' });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditDept(null);
    setFormData({ name: '', description: '', head: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editDept) {
        const res = await api.put(`/departments/${editDept._id}`, formData);
        setData(departments.map(d => d._id === editDept._id ? res.data.data : d));
      } else {
        const res = await api.post('/departments', formData);
        setData([...departments, res.data.data]);
      }
      setShowModal(false);
    } catch (err) {
      setErr(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/departments/${id}`);
      setData(departments.filter(d => d._id !== id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Department Management</h1>
        <Button variant="primary" onClick={openCreate}>Add Department</Button>
      </div>
      
      <Card className="shadow">
        <Card.Body>
          {loading ? <p>Loading...</p> : error ? <Alert variant="danger">{error}</Alert> : (
            <Table striped bordered hover responsive>
              <thead>
                <tr><th>Name</th><th>Description</th><th>Head</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {departments?.map(dept => (
                  <tr key={dept._id}>
                    <td>{dept.name}</td>
                    <td>{dept.description}</td>
                    <td>{dept.head?.name || 'N/A'}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => openEdit(dept)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(dept._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editDept ? 'Edit Department' : 'Add Department'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {err && <Alert variant="danger">{err}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Department Head</Form.Label><Form.Select value={formData.head} onChange={(e) => setFormData({...formData, head: e.target.value})}><option value="">Select Head</option>{users?.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}</Form.Select></Form.Group>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;