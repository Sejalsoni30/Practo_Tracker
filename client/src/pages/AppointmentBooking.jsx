import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Layout from '../components/Layout';

export default function AppointmentBooking() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ doctorId: '', patientName: '', date: '', timeSlot: '', symptoms: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/doctors').then(res => setDoctors(res.data)).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErrorMsg(''); setSuccessMsg('');
    try {
      await API.post('/appointments', formData);
      setSuccessMsg('✅ Appointment booked successfully!');
      setFormData({ doctorId: '', patientName: '', date: '', timeSlot: '', symptoms: '' });
    } catch (err) {
      setErrorMsg('❌ Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoc = doctors.find(d => d._id === formData.doctorId);

  return (
    <Layout title="Book Appointment">
      <div className="page-header">
        <h1>📅 Book Consultation Appointment</h1>
        <p>Schedule a new patient appointment with an available doctor.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', maxWidth: '900px' }}>
        <div className="card card-p">
          {successMsg && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{successMsg}</div>}
          {errorMsg && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{errorMsg}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Patient Name *</label>
              <input className="form-input" type="text" name="patientName" value={formData.patientName} onChange={handleChange} required placeholder="Full name of patient" />
            </div>
            <div className="form-group">
              <label className="form-label">Select Doctor *</label>
              <select className="form-input" name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                <option value="">-- Choose Doctor --</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialty})</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Appointment Date *</label>
                <input className="form-input" type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label className="form-label">Time Slot *</label>
                <input className="form-input" type="text" name="timeSlot" placeholder="e.g., 10:00 AM" value={formData.timeSlot} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Symptoms / Notes</label>
              <textarea className="form-input" name="symptoms" value={formData.symptoms} onChange={handleChange} rows="3" placeholder="Brief description of symptoms or reason for visit..." />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Booking...' : '✔ Confirm Appointment'}
            </button>
          </form>
        </div>

        {/* Doctor info card */}
        <div>
          {selectedDoc ? (
            <div className="card card-p" style={{ borderTop: '4px solid var(--teal)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👨‍⚕️</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{selectedDoc.name}</h3>
              <div style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>{selectedDoc.specialty}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Experience:</span> <strong>{selectedDoc.experience} years</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>Timing:</span> <strong>{selectedDoc.timing}</strong></div>
                <div style={{ marginTop: '0.5rem' }}><span className="badge badge-resolved">✓ Available</span></div>
              </div>
            </div>
          ) : (
            <div className="card card-p" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
              <p style={{ fontSize: '0.875rem' }}>Select a doctor to view their details and availability.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}