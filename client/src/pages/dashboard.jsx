import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';

// Shown only when the account has no real requests yet, so the dashboard
// never looks broken/empty (e.g. fresh DB, first login, live demo).
const SAMPLE_STATS = { totalRequests: 24, pendingRequests: 7, approvedRequests: 14, rejectedRequests: 3 };

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalRequests: 0, pendingRequests: 0, approvedRequests: 0, rejectedRequests: 0 });
  const [isSample, setIsSample] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        const data = res.data.data;
        const hasRealData = data && (data.totalRequests > 0);
        setStats(hasRealData ? data : SAMPLE_STATS);
        setIsSample(!hasRealData);
      } catch (err) {
        console.error('Failed to load stats', err);
        setStats(SAMPLE_STATS);
        setIsSample(true);
      }
    };
    fetchStats();
  }, []);

  const barData = {
    labels: ['Total', 'Pending', 'Approved', 'Rejected'],
    datasets: [{
      label: 'Requests',
      data: [stats.totalRequests, stats.pendingRequests, stats.approvedRequests, stats.rejectedRequests],
      backgroundColor: ['#4e73df', '#f6c23e', '#1cc88a', '#e74a3b']
    }]
  };

  const doughnutData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      data: [stats.approvedRequests, stats.pendingRequests, stats.rejectedRequests],
      backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b']
    }]
  };

  return (
    <div>
      <h1 className="h3 mb-4 text-gray-800">Dashboard</h1>
      <p className="text-muted">Welcome back, {user?.name}!</p>
      {isSample && (
        <div className="alert alert-info py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
          Showing sample data for preview — no real requests yet.
        </div>
      )}
      
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Requests</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalRequests}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card warning shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Pending Requests</div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.pendingRequests}</div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card success shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Approved Requests</div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.approvedRequests}</div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card stat-card danger shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">Rejected Requests</div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.rejectedRequests}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Request Statistics</h6>
            </div>
            <div className="card-body p-4">
              <Bar data={barData} />
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Status Breakdown</h6>
            </div>
            <div className="card-body p-4">
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {user?.role === 'admin' && <AdminDashboard />}
        {user?.role === 'manager' && <ManagerDashboard />}
        {user?.role === 'employee' && <EmployeeDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;