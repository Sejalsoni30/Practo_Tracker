import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

function PriorityBadge({ p }) {
  const map = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low', 'No Issue': 'badge-noissue' };
  return <span className={`badge ${map[p] || 'badge-low'}`}>{p}</span>;
}

function nextAction(appt) {
  const daysMissed = Math.floor((Date.now() - new Date(appt.date)) / (1000 * 60 * 60 * 24));
  if (daysMissed > 7) return { priority: 'High', action: 'Contact patient immediately — missed over 7 days ago' };
  if (daysMissed > 3) return { priority: 'Medium', action: 'Call patient to reschedule within 24 hours' };
  return { priority: 'Low', action: 'Send SMS reminder and schedule follow-up' };
}

export default function MissedAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics')
      .then(res => {
        setAppointments(res.data.missedAppointments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const high = appointments.filter(a => nextAction(a).priority === 'High');
  const medium = appointments.filter(a => nextAction(a).priority === 'Medium');
  const low = appointments.filter(a => nextAction(a).priority === 'Low');

  return (
    <Layout title="Missed Appointments">
      <div className="page-header">
        <h1>⚠️ Missed Appointments</h1>
        <p>Appointments that were scheduled but not completed. Take action based on priority.</p>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderTop: '4px solid #e53e3e' }}>
          <div className="stat-icon" style={{ background: '#fff5f5' }}>🔴</div>
          <div className="stat-value" style={{ color: '#e53e3e' }}>{high.length}</div>
          <div className="stat-label">High Priority</div>
          <div className="stat-sub">Missed &gt;7 days ago</div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid #dd6b20' }}>
          <div className="stat-icon" style={{ background: '#fffaf0' }}>🟠</div>
          <div className="stat-value" style={{ color: '#dd6b20' }}>{medium.length}</div>
          <div className="stat-label">Medium Priority</div>
          <div className="stat-sub">Missed 3–7 days ago</div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid #38a169' }}>
          <div className="stat-icon" style={{ background: '#f0fff4' }}>🟢</div>
          <div className="stat-value" style={{ color: '#38a169' }}>{low.length}</div>
          <div className="stat-label">Low Priority</div>
          <div className="stat-sub">Missed 1–3 days ago</div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
      ) : appointments.length === 0 ? (
        <div className="card card-p">
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h3>No Missed Appointments!</h3>
            <p>All patients are up-to-date with their appointments.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
            <strong style={{ fontSize: '0.9rem' }}>All Missed Appointments ({appointments.length})</strong>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Scheduled Date</th>
                  <th>Time Slot</th>
                  <th>Days Missed</th>
                  <th>Priority</th>
                  <th>Suggested Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => {
                  const { priority, action } = nextAction(a);
                  const days = Math.floor((Date.now() - new Date(a.date)) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={a._id}>
                      <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                      <td>{a.date}</td>
                      <td>{a.timeSlot}</td>
                      <td style={{ color: days > 7 ? '#e53e3e' : days > 3 ? '#dd6b20' : '#38a169', fontWeight: 700 }}>{days}d</td>
                      <td><PriorityBadge p={priority} /></td>
                      <td style={{ maxWidth: '280px' }}>
                        <div className="next-action-box">{action}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
