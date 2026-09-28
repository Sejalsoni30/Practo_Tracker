import React, { useState } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

function StatusBadge({ s }) {
  const map = { Scheduled: 'badge-scheduled', Completed: 'badge-completed', Cancelled: 'badge-cancelled', 'Pending Follow-up': 'badge-pending' };
  return <span className={`badge ${map[s] || 'badge-low'}`}>{s}</span>;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await API.get(`/analytics/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch {
      setResults({ appointments: [], doctors: [], complaints: [] });
    } finally {
      setLoading(false);
    }
  };

  const totalResults = results ? (results.appointments.length + results.doctors.length + results.complaints.length) : 0;

  return (
    <Layout title="Search">
      <div className="page-header">
        <h1>🔍 Global Search</h1>
        <p>Search across patients, appointments, doctors, and complaints in one place.</p>
      </div>

      <form onSubmit={handleSearch} style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <span>🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search patient name, doctor, specialty..."
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div>}

      {results && !loading && (
        <>
          <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Found <strong style={{ color: 'var(--text)' }}>{totalResults} result{totalResults !== 1 ? 's' : ''}</strong> for "<strong style={{ color: 'var(--teal)' }}>{query}</strong>"
          </div>

          {/* Appointments */}
          {results.appointments.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.9rem' }}>
                📅 Appointments ({results.appointments.length})
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time Slot</th><th>Status</th></tr></thead>
                  <tbody>
                    {results.appointments.map(a => (
                      <tr key={a._id}>
                        <td style={{ fontWeight: 600 }}>{a.patientName}</td>
                        <td>{a.doctorId?.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({a.doctorId?.specialty})</span></td>
                        <td>{a.date}</td>
                        <td>{a.timeSlot}</td>
                        <td><StatusBadge s={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Doctors */}
          {results.doctors.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.9rem' }}>
                👨‍⚕️ Doctors ({results.doctors.length})
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Specialty</th><th>Experience</th><th>Timing</th></tr></thead>
                  <tbody>
                    {results.doctors.map(d => (
                      <tr key={d._id}>
                        <td style={{ fontWeight: 600 }}>{d.name}</td>
                        <td>{d.specialty}</td>
                        <td>{d.experience} yrs</td>
                        <td style={{ fontSize: '0.82rem' }}>{d.timing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Complaints */}
          {results.complaints.length > 0 && (
            <div className="card">
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.9rem' }}>
                📋 Complaints ({results.complaints.length})
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Patient</th><th>Category</th><th>Priority</th><th>Status</th></tr></thead>
                  <tbody>
                    {results.complaints.map(c => (
                      <tr key={c._id}>
                        <td style={{ fontWeight: 600 }}>{c.patientName}</td>
                        <td>{c.category}</td>
                        <td><span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span></td>
                        <td><span className={`badge badge-${c.status.toLowerCase().replace(' ', '')}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="card card-p">
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try a different search term like a patient name, doctor name, or specialty.</p>
              </div>
            </div>
          )}
        </>
      )}

      {!results && !loading && (
        <div className="card card-p">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Start Searching</h3>
            <p>Enter a patient name, doctor name, or specialty to find records across the system.</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
