import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

const CATEGORIES = ['All', 'Service Quality', 'Doctor Behavior', 'Billing Issue', 'Wait Time', 'Facility Issue', 'Other'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];
const STATUSES = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

function PriorityBadge({ p }) {
  const map = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low', 'No Issue': 'badge-noissue' };
  return <span className={`badge ${map[p] || 'badge-low'}`}>{p}</span>;
}

function StatusBadge({ s }) {
  const map = { Open: 'badge-open', 'In Progress': 'badge-inprogress', Resolved: 'badge-resolved', Closed: 'badge-closed' };
  return <span className={`badge ${map[s] || 'badge-low'}`}>{s}</span>;
}

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filter, setFilter] = useState({ priority: 'All', status: 'All' });
  const [form, setForm] = useState({ patientName: '', patientContact: '', category: 'Service Quality', description: '', priority: 'Medium' });
  const [msg, setMsg] = useState('');

  const load = () => {
    API.get('/complaints').then(r => { setComplaints(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/complaints', form);
      setMsg('Complaint registered successfully!');
      setShowModal(false);
      setForm({ patientName: '', patientContact: '', category: 'Service Quality', description: '', priority: 'Medium' });
      load();
    } catch (err) {
      setMsg('Error registering complaint.');
    }
  };

  const handleUpdate = async (id, update) => {
    await API.put(`/complaints/${id}`, update);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    await API.delete(`/complaints/${id}`);
    load();
  };

  const filtered = complaints.filter(c => {
    if (filter.priority !== 'All' && c.priority !== filter.priority) return false;
    if (filter.status !== 'All' && c.status !== filter.status) return false;
    return true;
  });

  return (
    <Layout title="Complaints">
      <div className="page-header">
        <h1>📋 Patient Complaints</h1>
        <p>Track and resolve patient complaints with priority classification and next action suggestions.</p>
      </div>

      {msg && <div className={`alert ${msg.includes('Error') ? 'alert-error' : 'alert-success'}`}>{msg}</div>}

      {/* Filters + Add */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select className="form-input" style={{ width: 'auto' }} value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="form-input" style={{ width: 'auto' }} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Complaint</button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><h3>No complaints found</h3><p>All clear!</p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Patient</th><th>Category</th><th>Description</th><th>Priority</th><th>Status</th><th>Next Action</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.patientName}</div>
                      {c.patientContact && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.patientContact}</div>}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{c.category}</td>
                    <td style={{ maxWidth: '200px', fontSize: '0.82rem' }}>{c.description}</td>
                    <td><PriorityBadge p={c.priority} /></td>
                    <td>
                      <select
                        className="form-input" style={{ width: '130px', fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                        value={c.status}
                        onChange={e => handleUpdate(c._id, { status: e.target.value, assignedTo: c.assignedTo, nextAction: c.nextAction })}
                      >
                        {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      {c.nextAction && <div className="next-action-box" style={{ fontSize: '0.75rem' }}>{c.nextAction}</div>}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Complaint</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Patient Name *</label>
                  <input className="form-input" required value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} placeholder="Patient full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Number</label>
                  <input className="form-input" value={form.patientContact} onChange={e => setForm(f => ({ ...f, patientContact: e.target.value }))} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" rows={3} required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the complaint..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
