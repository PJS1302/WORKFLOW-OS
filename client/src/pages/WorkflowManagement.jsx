import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Table, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../services/api';

const WorkflowManagement = () => {
  const { data: workflows, loading, error, setData } = useFetch('/workflows');
  const { data: templates } = useFetch('/workflows/templates');
  const [showModal, setShowModal] = useState(false);
  const [editWf, setEditWf] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', template: '' });
  const [err, setErr] = useState('');

  const openEdit = (wf) => {
    setEditWf(wf);
    setFormData({ name: wf.name, description: wf.description, template: wf.template?._id || '' });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditWf(null);
    setFormData({ name: '', description: '', template: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editWf) {
        const res = await api.put(`/workflows/${editWf._id}`, formData);
        setData(workflows.map(w => w._id === editWf._id ? res.data.data : w));
      } else {
        const res = await api.post('/workflows', formData);
        setData([...workflows, res.data.data]);
      }
      setShowModal(false);
    } catch (err) {
      setErr(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/workflows/${id}`);
      setData(workflows.filter(w => w._id !== id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Workflow Management</h1>
        <Button variant="primary" onClick={openCreate}>Add Workflow</Button>
      </div>
      
      <Card className="shadow">
        <Card.Body>
          {loading ? <p>Loading...</p> : error ? <Alert variant="danger">{error}</Alert> : (
            <Table striped bordered hover responsive>
              <thead><tr><th>Name</th><th>Template</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {workflows?.map(wf => (
                  <tr key={wf._id}>
                    <td>{wf.name}</td>
                    <td>{wf.template?.name || 'N/A'}</td>
                    <td>{wf.description}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => openEdit(wf)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(wf._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editWf ? 'Edit Workflow' : 'Add Workflow'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {err && <Alert variant="danger">{err}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Template</Form.Label><Form.Select value={formData.template} onChange={(e) => setFormData({...formData, template: e.target.value})} required><option value="">Select Template</option>{templates?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}</Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></Form.Group>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WorkflowManagement;