import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appts, setAppts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    Promise.all([
      API.get('/analytics'),
      API.get('/appointments'),
      API.get('/complaints'),
      API.get('/tickets'),
    ]).then(([a, b, c, d]) => {
      setData(a.data);
      setAppts(b.data);
      setComplaints(c.data);
      setTickets(d.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const downloadCSV = (rows, headers, filename) => {
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportAppointments = () => {
    const rows = appts.map(a => ({ patientName: a.patientName, date: a.date, timeSlot: a.timeSlot, status: a.status, symptoms: a.symptoms || '' }));
    downloadCSV(rows, ['patientName', 'date', 'timeSlot', 'status', 'symptoms'], 'appointments_report.csv');
  };

  const exportComplaints = () => {
    const rows = complaints.map(c => ({ patientName: c.patientName, category: c.category, priority: c.priority, status: c.status, description: c.description, nextAction: c.nextAction || '' }));
    downloadCSV(rows, ['patientName', 'category', 'priority', 'status', 'description', 'nextAction'], 'complaints_report.csv');
  };

  const exportTickets = () => {
    const rows = tickets.map(t => ({ ticketNumber: t.ticketNumber, patientName: t.patientName, issueType: t.issueType, priority: t.priority, status: t.status, nextAction: t.nextAction || '' }));
    downloadCSV(rows, ['ticketNumber', 'patientName', 'issueType', 'priority', 'status', 'nextAction'], 'tickets_report.csv');
  };

  const printReport = () => window.print();

  return (
    <Layout title="Reports & Export">
      <div className="page-header">
        <h1>📄 Reports & Export</h1>
        <p>Generate and download detailed clinic reports in CSV format.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card" style={{ borderTop: '4px solid #3182ce' }}>
              <div className="stat-icon" style={{ background: '#ebf8ff' }}>📅</div>
              <div className="stat-value" style={{ color: '#3182ce' }}>{data?.totalAppointments || 0}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
            <div className="stat-card" style={{ borderTop: '4px solid #e53e3e' }}>
              <div className="stat-icon" style={{ background: '#fff5f5' }}>⚠️</div>
              <div className="stat-value" style={{ color: '#e53e3e' }}>{data?.missedCount || 0}</div>
              <div className="stat-label">Missed Appointments</div>
            </div>
            <div className="stat-card" style={{ borderTop: '4px solid #805ad5' }}>
              <div className="stat-icon" style={{ background: '#faf5ff' }}>📋</div>
              <div className="stat-value" style={{ color: '#805ad5' }}>{data?.totalComplaints || 0}</div>
              <div className="stat-label">Total Complaints</div>
            </div>
            <div className="stat-card" style={{ borderTop: '4px solid #d69e2e' }}>
              <div className="stat-icon" style={{ background: '#fffff0' }}>🎫</div>
              <div className="stat-value" style={{ color: '#d69e2e' }}>{data?.totalTickets || 0}</div>
              <div className="stat-label">Total Tickets</div>
            </div>
          </div>

          {/* Export Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { title: '📅 Appointments Report', desc: `Export all ${appts.length} appointment records with status, doctor, and symptoms.`, action: exportAppointments, color: '#3182ce' },
              { title: '📋 Complaints Report', desc: `Export all ${complaints.length} complaints with priority, category, and next actions.`, action: exportComplaints, color: '#805ad5' },
              { title: '🎫 Tickets Report', desc: `Export all ${tickets.length} service tickets with ticket numbers and resolution status.`, action: exportTickets, color: '#d69e2e' },
            ].map(card => (
              <div key={card.title} className="card card-p" style={{ borderTop: `4px solid ${card.color}` }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{card.desc}</p>
                <button className="btn btn-primary" style={{ background: card.color, width: '100%' }} onClick={card.action}>
                  ⬇ Download CSV
                </button>
              </div>
            ))}
          </div>

          {/* Priority Summary Table */}
          <div className="card">
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.95rem' }}>📊 Complete Summary Report</strong>
              <button className="btn btn-secondary btn-sm" onClick={printReport}>🖨 Print</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Category</th><th>Total</th><th>High Priority</th><th>Open / Active</th><th>Resolved / Done</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Appointments</td>
                    <td>{data?.totalAppointments || 0}</td>
                    <td style={{ color: '#e53e3e', fontWeight: 600 }}>{data?.missedCount || 0} missed</td>
                    <td>{data?.scheduledAppointments || 0}</td>
                    <td>{data?.completedAppointments || 0}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Follow-ups</td>
                    <td>{data?.urgentFollowUps?.length || 0}</td>
                    <td style={{ color: '#e53e3e', fontWeight: 600 }}>{data?.urgentFollowUps?.length || 0}</td>
                    <td>{data?.urgentFollowUps?.length || 0}</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Complaints</td>
                    <td>{data?.totalComplaints || 0}</td>
                    <td style={{ color: '#e53e3e', fontWeight: 600 }}>{data?.highPriorityComplaints || 0}</td>
                    <td>{data?.openComplaints || 0}</td>
                    <td>{(data?.totalComplaints || 0) - (data?.openComplaints || 0)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Service Tickets</td>
                    <td>{data?.totalTickets || 0}</td>
                    <td>—</td>
                    <td>{data?.openTickets || 0}</td>
                    <td>{(data?.totalTickets || 0) - (data?.openTickets || 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
