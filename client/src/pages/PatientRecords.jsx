import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

export default function PatientRecords() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/patients').then(res => { setPatients(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.contact.includes(search)
  );

  return (
    <Layout title="Patient Records">
      <div className="page-header">
        <h1>👥 Patient Records</h1>
        <p>View and manage all registered patient medical records.</p>
      </div>

      <div className="search-bar" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
        <span>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient name or contact..." />
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No patient records found</h3>
              <p>Patient records will appear here once appointments are booked.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr><th>#</th><th>Patient Name</th><th>Contact</th><th>Age / Gender</th><th>Last Diagnosis</th><th>Registered</th></tr>
              </thead>
              <tbody>
                {filtered.map((patient, i) => (
                  <tr key={patient._id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{patient.name}</td>
                    <td>{patient.contact}</td>
                    <td>{patient.age} yrs / {patient.gender}</td>
                    <td><span className="badge badge-inprogress">{patient.lastDiagnosis || 'General Checkup'}</span></td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{new Date(patient.createdAt).toLocaleDateString('en-IN')}</td>
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