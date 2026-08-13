import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [position, setPosition] = useState(user?.position || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await api.put('/auth/updatedetails', { name, position });
      const updated = res.data.data;
      if (updated) {
        updated.id = updated._id || updated.id;
      }
      setUser(updated);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <h1 className="h3 mb-4 text-gray-800">Profile Settings</h1>
        <Card className="shadow p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Profile updated successfully!</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={user?.email} disabled /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Position</Form.Label><Form.Control type="text" value={position} onChange={(e) => setPosition(e.target.value)} /></Form.Group>
            <Button variant="primary" type="submit">Update Profile</Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;