import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InteractiveCanvasBg from '../components/InteractiveCanvasBg';

const channels = [
  { icon: '📧', title: 'Email Support', detail: 'support@practotracker.com', sub: 'Response within 24 hours', color: '#00bfa5' },
  { icon: '🐛', title: 'Bug Reports', detail: 'bugs@practotracker.com', sub: 'Include steps to reproduce', color: '#ef4444' },
  { icon: '🔒', title: 'Privacy Concerns', detail: 'privacy@practotracker.com', sub: 'Data deletion requests', color: '#8b5cf6' },
  { icon: '💡', title: 'Feature Requests', detail: 'ideas@practotracker.com', sub: 'We love hearing from you', color: '#f59e0b' },
];

const faqs = [
  { q: 'How do I reset my password?', a: 'Contact our support team at support@practotracker.com and we will send you a reset link within 24 hours.' },
  { q: 'Can I export all my clinic data?', a: 'Yes! Go to Reports & Export in the dashboard sidebar. You can download CSVs for appointments, complaints, and tickets.' },
  { q: 'How do I add more doctors?', a: 'Doctors are seeded via the admin panel. Contact support if you need to add or remove doctors from your clinic account.' },
  { q: 'Is my patient data secure?', a: 'Yes. All data is stored in an encrypted MongoDB database. Passwords use bcrypt hashing and all connections use JWT authentication.' },
  { q: 'Can multiple staff members use the same account?', a: 'Currently the system supports one account per clinic. Multi-user role management is on our roadmap for the next release.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Enquiry', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: 'General Enquiry', message: '' });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#060912', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #00bfa5; border-radius: 3px; }

        .ct-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 5%;
          background: rgba(6,9,18,0.93);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          gap: 1rem;
        }
        .ct-logo { display: flex; align-items: center; gap: 0.65rem; text-decoration: none; min-width: 0; }
        .ct-logo-icon {
          width: 42px; height: 42px; flex-shrink: 0;
          background: linear-gradient(135deg,#00bfa5,#0097a7);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.25rem;
          box-shadow: 0 4px 14px rgba(0,191,165,0.32);
        }
        .ct-logo-texts { display: flex; flex-direction: column; min-width: 0; }
        .ct-logo-name { font-weight: 800; font-size: 1rem; color: #fff; line-height: 1.15; white-space: nowrap; }
        .ct-logo-sub  { font-size: 0.62rem; color: rgba(255,255,255,0.38); font-weight: 500; white-space: nowrap; }
        .ct-back-btn {
          padding: 0.48rem 1rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.8);
          font-size: 0.82rem; font-weight: 600;
          text-decoration: none; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .ct-back-btn:hover { background: rgba(255,255,255,0.13); color: #fff; }

        .ct-channels {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .ct-ch-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.35rem;
          transition: transform 0.2s, background 0.2s;
        }
        .ct-ch-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.055); }

        .ct-main-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 2rem;
        }
        .ct-form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 2rem;
        }
        .ct-input {
          width: 100%; padding: 0.7rem 0.9rem;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 10px; font-size: 0.875rem;
          font-family: inherit; color: #fff;
          background: rgba(255,255,255,0.05);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ct-input:focus { border-color: #00bfa5; box-shadow: 0 0 0 3px rgba(0,191,165,0.15); }
        .ct-input::placeholder { color: rgba(255,255,255,0.22); }
        select.ct-input option { background: #1a2332; color: #fff; }
        .ct-label { display: block; font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.42); margin-bottom: 0.4rem; }
        .ct-submit-btn {
          width: 100%; padding: 0.85rem;
          background: linear-gradient(135deg,#00bfa5,#0097a7);
          color: #fff; border: none; border-radius: 10px;
          font-weight: 700; font-size: 0.95rem; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 8px 24px rgba(0,191,165,0.28);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ct-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,191,165,0.4); }
        .ct-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .ct-faq-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 1rem 1.25rem;
          cursor: pointer; transition: border-color 0.2s, background 0.2s;
        }
        .ct-faq-item:hover { border-color: rgba(0,191,165,0.25); background: rgba(0,191,165,0.04); }
        .ct-faq-item.faq-open { border-color: rgba(0,191,165,0.35); }
        .ct-footer-links { display: flex; justify-content: center; gap: 2rem; margin-top: 3rem; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .ct-channels { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 768px) {
          .ct-main-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .ct-channels { grid-template-columns: 1fr 1fr; }
          .ct-row-2 { grid-template-columns: 1fr; }
          .ct-logo-sub { display: none; }
        }
        @media (max-width: 380px) {
          .ct-channels { grid-template-columns: 1fr; }
        }
      `}</style>

      <InteractiveCanvasBg />

      {/* ── Navbar ── */}
      <nav className="ct-nav">
        <Link to="/" className="ct-logo">
          <div className="ct-logo-icon">🏥</div>
          <div className="ct-logo-texts">
            <span className="ct-logo-name">Practo Tracker</span>
            <span className="ct-logo-sub">Clinic Appointment Analyzer</span>
          </div>
        </Link>
        <Link to="/" className="ct-back-btn">← Back to Home</Link>
      </nav>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '2.25rem 5% 2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,191,165,0.1)', border: '1px solid rgba(0,191,165,0.25)', borderRadius: '999px', padding: '0.35rem 1rem', fontSize: '0.75rem', color: '#00bfa5', fontWeight: 700, marginBottom: '1.25rem' }}>💬 Contact Us</div>
        <h1 style={{ fontSize: 'clamp(1.85rem,5vw,3rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.75rem', background: 'linear-gradient(135deg,#fff,rgba(255,255,255,0.65))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>We'd Love to Hear<br />From You</h1>
        <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>Our team is here to help. Send us a message or reach out through any of the channels below.</p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5% 6rem', position: 'relative', zIndex: 1 }}>

        {/* ── Contact channels ── */}
        <div className="ct-channels">
          {channels.map(ch => (
            <div key={ch.title} className="ct-ch-card" style={{ borderTop: `3px solid ${ch.color}` }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '0.65rem' }}>{ch.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem', color: '#fff' }}>{ch.title}</div>
              <div style={{ fontSize: '0.8rem', color: ch.color, fontWeight: 600, marginBottom: '0.2rem' }}>{ch.detail}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{ch.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Form + FAQ ── */}
        <div className="ct-main-grid">

          {/* ── Contact form ── */}
          <div className="ct-form-card">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Send a Message</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>We respond within 24 hours on business days.</p>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} style={{ padding: '0.6rem 1.5rem', background: '#00bfa5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Send Another →</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="ct-row-2">
                  <div>
                    <label className="ct-label">Your Name *</label>
                    <input className="ct-input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Full name" required />
                  </div>
                  <div>
                    <label className="ct-label">Email Address *</label>
                    <input className="ct-input" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@clinic.com" required />
                  </div>
                </div>
                <div>
                  <label className="ct-label">Subject</label>
                  <select className="ct-input" value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}>
                    {['General Enquiry', 'Bug Report', 'Feature Request', 'Privacy Concern', 'Account Issue', 'Other'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="ct-label">Message *</label>
                  <textarea className="ct-input" style={{ resize: 'vertical', minHeight: '130px' }} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Describe your issue or question in detail..." required />
                </div>
                <button type="submit" className="ct-submit-btn">Send Message 📨</button>
              </form>
            )}
          </div>

          {/* ── FAQ ── */}
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.3rem' }}>Frequently Asked</h2>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Quick answers to common questions.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} className={`ct-faq-item${openFaq === i ? ' faq-open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: openFaq === i ? '#00bfa5' : '#fff', lineHeight: 1.4 }}>{faq.q}</span>
                    <span style={{ color: '#00bfa5', fontSize: '1.1rem', flexShrink: 0, transition: 'transform 0.25s', transform: openFaq === i ? 'rotate(45deg)' : 'none', marginTop: '2px' }}>+</span>
                  </div>
                  {openFaq === i && (
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer links ── */}
        <div className="ct-footer-links">
          <Link to="/privacy" style={{ color: '#00bfa5', fontWeight: 600, fontSize: '0.875rem' }}>Privacy Policy →</Link>
          <Link to="/terms"   style={{ color: '#00bfa5', fontWeight: 600, fontSize: '0.875rem' }}>Terms of Service →</Link>
          <Link to="/"        style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600, fontSize: '0.875rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}


