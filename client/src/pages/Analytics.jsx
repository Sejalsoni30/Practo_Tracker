import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="Analytics"><div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div></Layout>;

  const apptBreakdown = [
    { label: 'Scheduled', value: data?.scheduledAppointments || 0, color: '#3182ce', icon: '📅' },
    { label: 'Completed', value: data?.completedAppointments || 0, color: '#38a169', icon: '✅' },
    { label: 'Cancelled', value: data?.cancelledAppointments || 0, color: '#e53e3e', icon: '❌' },
    { label: 'Missed', value: data?.missedCount || 0, color: '#dd6b20', icon: '⚠️' },
  ];

  const total = apptBreakdown.reduce((s, i) => s + i.value, 0) || 1;

  return (
    <Layout title="Analytics">
      <div className="page-header">
        <h1>📈 Clinic Analytics</h1>
        <p>Deep insights into appointment trends, complaint patterns, and doctor performance.</p>
      </div>

      {/* Appointment Breakdown */}
      <div className="card card-p" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Appointment Status Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {apptBreakdown.map(item => (
            <div key={item.label} style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '10px', border: `2px solid ${item.color}20` }}>
              <div style={{ fontSize: '2rem' }}>{item.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{Math.round((item.value / total) * 100)}%</div>
            </div>
          ))}
        </div>
        {/* Progress bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {apptBreakdown.map(item => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>{item.icon} {item.label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{item.value} / {total}</span>
              </div>
              <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((item.value / total) * 100)}%`, background: item.color, height: '100%', borderRadius: '999px', transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Complaint Stats */}
        <div className="card card-p">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📋 Complaint Overview</h3>
          {[
            { label: 'Total Complaints', value: data?.totalComplaints, color: '#805ad5' },
            { label: 'Open / In Progress', value: data?.openComplaints, color: '#e53e3e' },
            { label: 'High Priority (Unresolved)', value: data?.highPriorityComplaints, color: '#dd6b20' },
            { label: 'Resolved', value: (data?.totalComplaints || 0) - (data?.openComplaints || 0), color: '#38a169' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.875rem' }}>{row.label}</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: row.color }}>{row.value ?? 0}</span>
            </div>
          ))}
        </div>

        {/* Ticket Stats */}
        <div className="card card-p">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🎫 Ticket Overview</h3>
          {[
            { label: 'Total Tickets', value: data?.totalTickets, color: '#d69e2e' },
            { label: 'Open Tickets', value: data?.openTickets, color: '#e53e3e' },
            { label: 'Closed Tickets', value: (data?.totalTickets || 0) - (data?.openTickets || 0), color: '#38a169' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.875rem' }}>{row.label}</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: row.color }}>{row.value ?? 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Availability */}
      <div className="card">
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.95rem' }}>
          👨‍⚕️ Doctor Availability
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Doctor</th><th>Specialty</th><th>Experience</th><th>Timing</th><th>Status</th></tr></thead>
            <tbody>
              {(data?.doctors || []).map(d => (
                <tr key={d._id}>
                  <td style={{ fontWeight: 600 }}>{d.name}</td>
                  <td>{d.specialty}</td>
                  <td>{d.experience} yrs</td>
                  <td style={{ fontSize: '0.82rem' }}>{d.timing}</td>
                  <td><span className="badge badge-resolved">Available</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
