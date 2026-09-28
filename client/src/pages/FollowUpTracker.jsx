import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

function priorityBadge(dueDate) {
  if (!dueDate) return { label: 'No Issue', cls: 'badge-noissue' };
  const days = Math.floor((new Date(dueDate) - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: 'High', cls: 'badge-high' };
  if (days <= 2) return { label: 'Medium', cls: 'badge-medium' };
  return { label: 'Low', cls: 'badge-low' };
}

function nextActionText(dueDate) {
  if (!dueDate) return 'Schedule a follow-up date for this patient';
  const days = Math.floor((new Date(dueDate) - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return `Overdue by ${Math.abs(days)} days — contact patient immediately`;
  if (days === 0) return 'Follow-up due today — call patient now';
  if (days <= 2) return `Follow-up due in ${days} day(s) — prepare case notes`;
  return `Follow-up in ${days} days — send reminder SMS`;
}

export default function FollowUpTracker() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientName: '', dueDate: '', notes: '' });
  const [msg, setMsg] = useState('');

  const load = () => {
    API.get('/follow-ups').then(res => { setFollowUps(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/follow-ups', form);
      setMsg('Follow-up added!');
      setShowModal(false);
      setForm({ patientName: '', dueDate: '', notes: '' });
      load();
    } catch { setMsg('Error adding follow-up.'); }
  };

  const urgent = followUps.filter(f => priorityBadge(f.dueDate).label === 'High').length;
  const medium = followUps.filter(f => priorityBadge(f.dueDate).label === 'Medium').length;

  return (
    <Layout title="Follow-up Tracker">
      <div className="page-header">
        <h1>🩺 Patient Follow-up Tracker</h1>
        <p>Identify patients requiring urgent follow-up and track pending check-ins.</p>
      </div>

      {msg && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{msg}</div>}

      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderTop: '4px solid #e53e3e' }}>
          <div className="stat-icon" style={{ background: '#fff5f5' }}>🔴</div>
          <div className="stat-value" style={{ color: '#e53e3e' }}>{urgent}</div>
          <div className="stat-label">Overdue Follow-ups</div>
          <div className="stat-sub">Immediate action needed</div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid #dd6b20' }}>
          <div className="stat-icon" style={{ background: '#fffaf0' }}>🟠</div>
          <div className="stat-value" style={{ color: '#dd6b20' }}>{medium}</div>
          <div className="stat-label">Due Soon</div>
          <div className="stat-sub">Within 2 days</div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid #38a169' }}>
          <div className="stat-icon" style={{ background: '#f0fff4' }}>📋</div>
          <div className="stat-value" style={{ color: '#38a169' }}>{followUps.length}</div>
          <div className="stat-label">Total Follow-ups</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Follow-up</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : followUps.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🎉</div><h3>No pending follow-ups!</h3></div>
          ) : (
            <table>
              <thead>
                <tr><th>Patient Name</th><th>Due Date</th><th>Notes</th><th>Priority</th><th>Next Action</th></tr>
              </thead>
              <tbody>
                {followUps.map((item, index) => {
                  const { label, cls } = priorityBadge(item.dueDate);
                  const action = nextActionText(item.dueDate);
                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: 600 }}>{item.patientName}</td>
                      <td>{item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.notes || '—'}</td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
                      <td><div className="next-action-box" style={{ fontSize: '0.75rem' }}>{action}</div></td>
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
              <h3>Add Patient Follow-up</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Patient Name *</label>
                  <input className="form-input" required value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-input" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any relevant notes..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Follow-up</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}