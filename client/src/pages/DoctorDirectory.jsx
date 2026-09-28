import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/doctors').then(res => { setDoctors(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Doctor Directory">
      <div className="page-header">
        <h1>👨‍⚕️ Doctor Directory</h1>
        <p>Browse all available specialists and their clinic timings.</p>
      </div>

      <div className="search-bar" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
        <span>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or specialty..." />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(doc => (
            <div key={doc._id} className="card card-p" style={{ borderTop: '4px solid var(--teal)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👨‍⚕️</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{doc.name}</h3>
              <div style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem' }}>{doc.specialty}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div>🏆 <strong>{doc.experience} years</strong> experience</div>
                <div>🕐 {doc.timing}</div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <span className="badge badge-resolved">✓ Available</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <div className="empty-icon">👨‍⚕️</div>
              <h3>No doctors found</h3>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}