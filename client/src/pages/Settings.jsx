import { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const res = await api.put('/auth/updatepassword', { currentPassword, newPassword });
      setMessage(res.data.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    }
  };

  const handleAI = async () => {
    setError(''); setMessage('');
    try {
      const res = await api.post('/ai/recommendations', { workflowType: 'Leave Request' });
      setMessage(res.data.data);
    } catch (err) {
      setError('AI Service unavailable');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h1 className="h3 mb-4 text-gray-800">System Settings</h1>

        <Card className="shadow p-4 mb-4">
          <h5>Change Password</h5>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Current Password</Form.Label><Form.Control type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>New Password</Form.Label><Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></Form.Group>
            <Button variant="primary" type="submit">Update Password</Button>
          </Form>
        </Card>

        {user?.role === 'admin' && (
          <Card className="shadow p-4">
            <h5>AI Assistant Configuration</h5>
            <p className="text-muted">Test AI recommendations for workflow improvements.</p>
            <Button variant="success" onClick={handleAI}>Get AI Recommendation</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;