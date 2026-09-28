import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

const ISSUE_TYPES = ['Appointment Rescheduling', 'Prescription Refill', 'Lab Report', 'Insurance Query', 'Referral', 'Other'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];
const STATUSES = ['All', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

function PriorityBadge({ p }) {
  const map = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
  return <span className={`badge ${map[p] || 'badge-low'}`}>{p}</span>;
}

function StatusBadge({ s }) {
  const map = { Open: 'badge-open', 'In Progress': 'badge-inprogress', Resolved: 'badge-resolved', Closed: 'badge-closed', Pending: 'badge-pending' };
  return <span className={`badge ${map[s] || 'badge-low'}`}>{s}</span>;
}

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({ priority: 'All', status: 'All' });
  const [form, setForm] = useState({ patientName: '', issueType: 'Appointment Rescheduling', description: '', priority: 'Medium', dueDate: '' });
  const [msg, setMsg] = useState('');

  const load = () => {
    API.get('/tickets').then(r => { setTickets(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tickets', form);
      setMsg('Ticket created successfully!');
      setShowModal(false);
      setForm({ patientName: '', issueType: 'Appointment Rescheduling', description: '', priority: 'Medium', dueDate: '' });
      load();
    } catch { setMsg('Error creating ticket.'); }
  };

  const handleUpdate = async (id, update) => {
    await API.put(`/tickets/${id}`, update);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ticket?')) return;
    await API.delete(`/tickets/${id}`);
    load();
  };

  const filtered = tickets.filter(t => {
    if (filter.priority !== 'All' && t.priority !== filter.priority) return false;
    if (filter.status !== 'All' && t.status !== filter.status) return false;
    return true;
  });

  return (
    <Layout title="Service Tickets">
      <div className="page-header">
        <h1>🎫 Service Tickets</h1>
        <p>Track pending and delayed service requests. Each ticket gets a priority and suggested action.</p>
      </div>

      {msg && <div className={`alert ${msg.includes('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select className="form-input" style={{ width: 'auto' }} value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="form-input" style={{ width: 'auto' }} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Ticket</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🎫</div><h3>No tickets found</h3></div>
          ) : (
            <table>
              <thead>
                <tr><th>Ticket #</th><th>Patient</th><th>Issue Type</th><th>Priority</th><th>Due Date</th><th>Status</th><th>Next Action</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Resolved' && t.status !== 'Closed';
                  return (
                    <tr key={t._id} style={isOverdue ? { background: '#fff5f5' } : {}}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--teal)' }}>{t.ticketNumber}</td>
                      <td style={{ fontWeight: 600 }}>{t.patientName}</td>
                      <td style={{ fontSize: '0.82rem' }}>{t.issueType}</td>
                      <td><PriorityBadge p={t.priority} /></td>
                      <td style={{ fontSize: '0.82rem', color: isOverdue ? '#e53e3e' : 'inherit' }}>
                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-IN') : '—'}
                        {isOverdue && <div style={{ fontSize: '0.7rem', color: '#e53e3e' }}>⚠ Overdue</div>}
                      </td>
                      <td>
                        <select
                          className="form-input" style={{ width: '130px', fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                          value={t.status}
                          onChange={e => handleUpdate(t._id, { status: e.target.value, assignedTo: t.assignedTo, nextAction: t.nextAction })}
                        >
                          {['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        {t.nextAction && <div className="next-action-box" style={{ fontSize: '0.75rem' }}>{t.nextAction}</div>}
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Service Ticket</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Patient Name *</label>
                  <input className="form-input" required value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Issue Type</label>
                  <select className="form-input" value={form.issueType} onChange={e => setForm(f => ({ ...f, issueType: e.target.value }))}>
                    {ISSUE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                      {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" rows={3} required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
