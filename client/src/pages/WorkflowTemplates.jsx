import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Table, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../services/api';
import { WORKFLOW_TYPES } from '../utils/constants';

const WorkflowTemplates = () => {
  const { data: templates, loading, error, setData } = useFetch('/workflows/templates');
  const [showModal, setShowModal] = useState(false);
  const [editTmpl, setEditTmpl] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: WORKFLOW_TYPES[0], description: '' });
  const [err, setErr] = useState('');

  const openEdit = (tmpl) => {
    setEditTmpl(tmpl);
    setFormData({ name: tmpl.name, type: tmpl.type, description: tmpl.description });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditTmpl(null);
    setFormData({ name: '', type: WORKFLOW_TYPES[0], description: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editTmpl) {
        const res = await api.put(`/workflows/templates/${editTmpl._id}`, formData);
        setData(templates.map(t => t._id === editTmpl._id ? res.data.data : t));
      } else {
        const res = await api.post('/workflows/templates', formData);
        setData([...templates, res.data.data]);
      }
      setShowModal(false);
    } catch (err) {
      setErr(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/workflows/templates/${id}`);
      setData(templates.filter(t => t._id !== id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Workflow Templates</h1>
        <Button variant="primary" onClick={openCreate}>Add Template</Button>
      </div>
      
      <Card className="shadow">
        <Card.Body>
          {loading ? <p>Loading...</p> : error ? <Alert variant="danger">{error}</Alert> : (
            <Table striped bordered hover responsive>
              <thead><tr><th>Name</th><th>Type</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {templates?.map(tmpl => (
                  <tr key={tmpl._id}>
                    <td>{tmpl.name}</td>
                    <td>{tmpl.type}</td>
                    <td>{tmpl.description}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => openEdit(tmpl)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(tmpl._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editTmpl ? 'Edit Template' : 'Add Template'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {err && <Alert variant="danger">{err}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Type</Form.Label><Form.Select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>{WORKFLOW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></Form.Group>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WorkflowTemplates;