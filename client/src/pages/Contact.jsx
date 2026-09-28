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
  { q: 'How do I reset my password?', a: 'Currently you can contact our support team at support@practotracker.com and we will send you a reset link within 24 hours.' },
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #00bfa5; border-radius: 3px; } .faq-item:hover { border-color: rgba(0,191,165,0.3) !important; }`}</style>
      <InteractiveCanvasBg />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', background: 'rgba(6,9,18,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#00bfa5,#0097a7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🏥</div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Practo Tracker</span>
        </Link>
        <Link to="/" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>← Back to Home</Link>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '2rem 5% 3rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,191,165,0.1)', border: '1px solid rgba(0,191,165,0.25)', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.78rem', color: '#00bfa5', fontWeight: 600, marginBottom: '1.5rem' }}>💬 Contact Us</div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem', background: 'linear-gradient(135deg,#fff,rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>We'd Love to Hear<br />From You</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>Our team is here to help. Send us a message or reach out through any of the channels below.</p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5% 6rem', position: 'relative', zIndex: 1 }}>

        {/* Contact channels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {channels.map(ch => (
            <div key={ch.title} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: '16px', padding: '1.5rem', transition: 'all 0.2s', borderTop: `3px solid ${ch.color}` }}
              onMouseEnter={e => { e.currentTarget.style.background = `rgba(${ch.color.slice(1).match(/.{2}/g).map(h=>parseInt(h,16)).join(',')},0.07)`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{ch.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem', color: '#fff' }}>{ch.title}</div>
              <div style={{ fontSize: '0.85rem', color: ch.color, fontWeight: 600, marginBottom: '0.25rem' }}>{ch.detail}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{ch.sub}</div>
            </div>
          ))}
        </div>

        {/* Form + FAQ grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>

          {/* Contact form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2rem' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Your Name *</label>
                    <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Full name" required />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@clinic.com" required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select style={inputStyle} value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}>
                    {['General Enquiry', 'Bug Report', 'Feature Request', 'Privacy Concern', 'Account Issue', 'Other'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '130px' }} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Describe your issue or question in detail..." required />
                </div>
                <button type="submit" style={{ padding: '0.8rem', background: 'linear-gradient(135deg,#00bfa5,#0097a7)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(0,191,165,0.3)' }}>
                  Send Message 📨
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Frequently Asked</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Quick answers to common questions.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${openFaq === i ? 'rgba(0,191,165,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: openFaq === i ? '#00bfa5' : '#fff' }}>{faq.q}</span>
                    <span style={{ color: '#00bfa5', fontSize: '1rem', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                  </div>
                  {openFaq === i && (
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ color: '#00bfa5', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy →</Link>
          <Link to="/terms" style={{ color: '#00bfa5', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service →</Link>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' };
const inputStyle = { width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.875rem', fontFamily: 'inherit', color: '#fff', background: 'rgba(255,255,255,0.05)', outline: 'none', boxSizing: 'border-box' };
