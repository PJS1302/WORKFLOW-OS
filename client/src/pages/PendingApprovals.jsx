import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Table, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { getStatusBadge, formatDate } from '../utils/formatters';
import api from '../services/api';

const PendingApprovals = () => {
  const { data: requests, loading, error, setData } = useFetch('/requests');
  const [showModal, setShowModal] = useState(false);
  const [currentReq, setCurrentReq] = useState(null);
  const [comment, setComment] = useState('');
  const [actionError, setActionError] = useState('');

  const handleAction = async (status) => {
    setActionError('');
    try {
      await api.put(`/requests/${currentReq._id}/${status}`, { comment });
      setData(requests.filter(r => r._id !== currentReq._id));
      setShowModal(false);
      setComment('');
    } catch (err) {
      setActionError(err.response?.data?.error || 'Action failed');
    }
  };

  return (
    <div>
      <h1 className="h3 mb-4 text-gray-800">Pending Approvals</h1>
      <Card className="shadow">
        <Card.Body>
          {loading ? <p>Loading...</p> : error ? <Alert variant="danger">{error}</Alert> : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Requester</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests?.filter(r => r.status === 'pending').map(req => (
                  <tr key={req._id}>
                    <td>{req.title}</td>
                    <td>{req.type}</td>
                    <td>{req.user?.name}</td>
                    <td>{formatDate(req.createdAt)}</td>
                    <td>{getStatusBadge(req.status)}</td>
                    <td>
                      <Button variant="success" size="sm" onClick={() => { setCurrentReq(req); setShowModal(true); }}>
                        Review
                      </Button>
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
          <Modal.Title>Review Request: {currentReq?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionError && <Alert variant="danger">{actionError}</Alert>}
          <p><strong>Description:</strong> {currentReq?.description}</p>
          <Form.Group>
            <Form.Label>Comment</Form.Label>
            <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleAction('reject')}>Reject</Button>
          <Button variant="success" onClick={() => handleAction('approve')}>Approve</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingApprovals;