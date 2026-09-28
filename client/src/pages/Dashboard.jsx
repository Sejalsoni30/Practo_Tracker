import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

function StatCard({ icon, value, label, sub, color, bg, to }) {
  const card = (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ background: bg }}>{icon}</div>
      <div className="stat-value" style={{ color }}>{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{card}</Link> : card;
}

function PriorityBadge({ priority }) {
  const map = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low', 'No Issue': 'badge-noissue' };
  return <span className={`badge ${map[priority] || 'badge-low'}`}>{priority}</span>;
}

function StatusBadge({ status }) {
  const map = {
    Scheduled: 'badge-scheduled', Completed: 'badge-completed',
    Cancelled: 'badge-cancelled', 'Pending Follow-up': 'badge-pending',
    Open: 'badge-open', 'In Progress': 'badge-inprogress',
    Resolved: 'badge-resolved', Closed: 'badge-closed'
  };
  return <span className={`badge ${map[status] || 'badge-low'}`}>{status}</span>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    API.get('/analytics')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout title="Dashboard">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div className="spinner" />
      </div>
    </Layout>
  );

  const missed = data?.missedAppointments || [];
  const urgent = data?.urgentFollowUps || [];
  const today = data?.todayAppointments || [];

  return (
    <Layout title="Dashboard">
      {/* Greeting */}
      <div className="page-header">
        <h1>Good {getGreeting()}, {user?.name || 'Staff'} 👋</h1>
        <p>Here's what's happening at the clinic today.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <StatCard icon="📅" value={data?.totalAppointments} label="Total Appointments" sub={`${data?.scheduledAppointments} scheduled`} color="#3182ce" bg="#ebf8ff" to="/book-appointment" />
        <StatCard icon="⚠️" value={data?.missedCount} label="Missed Appointments" sub="Needs follow-up" color="#e53e3e" bg="#fff5f5" to="/missed-appointments" />
        <StatCard icon="🩺" value={data?.urgentFollowUps?.length} label="Urgent Follow-ups" sub="Pending action" color="#dd6b20" bg="#fffaf0" to="/follow-ups" />
        <StatCard icon="✅" value={data?.completedAppointments} label="Completed" sub="All time" color="#38a169" bg="#f0fff4" />
        <StatCard icon="📋" value={data?.openComplaints} label="Open Complaints" sub={`${data?.highPriorityComplaints} high priority`} color="#805ad5" bg="#faf5ff" to="/complaints" />
        <StatCard icon="🎫" value={data?.openTickets} label="Open Tickets" sub={`of ${data?.totalTickets} total`} color="#d69e2e" bg="#fffff0" to="/tickets" />
        <StatCard icon="👨‍⚕️" value={data?.totalDoctors} label="Doctors Available" sub="Active staff" color="#00bfa5" bg="#e0f7f4" to="/doctors" />
        <StatCard icon="🏥" value={today.length} label="Today's Appointments" sub="Scheduled today" color="#3182ce" bg="#ebf8ff" />
      </div>

      <div className="dash-two-col">
        {/* Missed Appointments */}
        <div className="card card-p">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>⚠️ Missed Appointments</h3>
            <Link to="/missed-appointments" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {missed.length === 0 ? (
            <div className="empty-state"><p>No missed appointments 🎉</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {missed.slice(0, 5).map(a => (
                <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: '#fff5f5', borderRadius: '8px', fontSize: '0.82rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.patientName}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{a.date} · {a.timeSlot}</div>
                  </div>
                  <span className="badge badge-high">Missed</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Urgent Follow-ups */}
        <div className="card card-p">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>🩺 Urgent Follow-ups</h3>
            <Link to="/follow-ups" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {urgent.length === 0 ? (
            <div className="empty-state"><p>No urgent follow-ups 🎉</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {urgent.slice(0, 5).map(a => (
                <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: '#fffaf0', borderRadius: '8px', fontSize: '0.82rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.patientName}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Dr. {a.doctorId?.name}</div>
                  </div>
                  <PriorityBadge priority="High" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>📅 Today's Appointments</h3>
          <Link to="/book-appointment" className="btn btn-primary btn-sm">+ Book New</Link>
        </div>
        <div className="table-wrap">
          {today.length === 0 ? (
            <div className="empty-state"><p>No appointments scheduled for today.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th><th>Doctor</th><th>Time Slot</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {today.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                    <td>{a.doctorId?.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({a.doctorId?.specialty})</span></td>
                    <td>{a.timeSlot}</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}