export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getStatusBadge = (status) => {
  switch (status) {
    case 'approved':
    case 'completed':
      return <span className="badge bg-success">{status}</span>;
    case 'rejected':
      return <span className="badge bg-danger">{status}</span>;
    case 'pending':
      return <span className="badge bg-warning text-dark">{status}</span>;
    default:
      return <span className="badge bg-secondary">{status}</span>;
  }
};