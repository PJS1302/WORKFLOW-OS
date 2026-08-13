import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, Button, Table } from 'react-bootstrap';
import api from '../services/api';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await api.post('/reports/generate', {});
      setReportData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: reportData?.map(d => d._id) || [],
    datasets: [{
      label: 'Request Counts',
      data: reportData?.map(d => d.count) || [],
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e']
    }]
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Reports & Analytics</h1>
        <Button variant="primary" onClick={generateReport} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <Card className="shadow">
            <Card.Header><h6 className="m-0 font-weight-bold text-primary">Chart View</h6></Card.Header>
            <Card.Body>{reportData ? <Bar data={chartData} /> : <p className="text-center">No data generated yet.</p>}</Card.Body>
          </Card>
        </div>
        <div className="col-lg-6 mb-4">
          <Card className="shadow">
            <Card.Header><h6 className="m-0 font-weight-bold text-primary">Tabular View</h6></Card.Header>
            <Card.Body>
              {reportData ? (
                <Table striped bordered hover>
                  <thead><tr><th>Type</th><th>Total</th><th>Approved</th><th>Rejected</th><th>Pending</th></tr></thead>
                  <tbody>
                    {reportData.map((d, i) => (
                      <tr key={i}>
                        <td>{d._id}</td>
                        <td>{d.count}</td>
                        <td>{d.approved}</td>
                        <td>{d.rejected}</td>
                        <td>{d.pending}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : <p className="text-center">No data generated yet.</p>}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;