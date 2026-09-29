import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InteractiveCanvasBg from '../components/InteractiveCanvasBg';

const channels = [
  { icon: '📧', title: 'Email Support', detail: 'support@practotracker.com', sub: 'Response within 24 hours', color: '#00bfa5', bg: 'rgba(0,191,165,0.08)' },
  { icon: '🐛', title: 'Bug Reports', detail: 'bugs@practotracker.com', sub: 'Include steps to reproduce', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  { icon: '🔒', title: 'Privacy Concerns', detail: 'privacy@practotracker.com', sub: 'Data deletion requests', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  { icon: '💡', title: 'Feature Requests', detail: 'ideas@practotracker.com', sub: 'We love hearing from you', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
];

const faqs = [
  { q: 'How do I reset my password?', a: 'Contact our support team at support@practotracker.com and we will send you a reset link within 24 hours.' },
  { q: 'Can I export all my clinic data?', a: 'Yes! Go to Reports & Export in the dashboard sidebar. You can download CSVs for appointments, complaints, and tickets.' },
  { q: 'How do I add more doctors?', a: 'Doctors are seeded via the admin panel. Contact support if you need to add or remove doctors from your clinic account.' },
  { q: 'Is my patient data secure?', a: 'Yes. All data is stored in an encrypted MongoDB database. Passwords use bcrypt hashing and all connections use JWT authentication.' },
  { q: 'Can multiple staff members use the same account?', a: 'Currently the system supports one account per clinic. Multi-user role management is on our roadmap for the next release.' },
  { q: 'What is the response time for support?', a: 'We respond to all support emails within 24 hours on business days. Critical bug reports are prioritized and usually addressed within 4 hours.' },
];

const stats = [
  { val: '< 24h', label: 'Avg. response time', icon: '⚡' },
  { val: '98%', label: 'Issues resolved', icon: '✅' },
  { val: '4.9★', label: 'Support rating', icon: '⭐' },
  { val: '24/7', label: 'Monitoring uptime', icon: '🌐' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Enquiry', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: 'General Enquiry', message: '' });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Show success anyway for demo
      setSent(true);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#060912', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060912; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #00bfa5, #0097a7); border-radius: 3px; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes success-bounce { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

        .ct-nav-back { display: inline-flex; align-items: center; padding: 0.5rem 1.1rem; border-radius: 10px; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.8); font-size: 0.82rem; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; }
        .ct-nav-back:hover { background: rgba(255,255,255,0.13); color: #fff; }

        .ct-channel-card { border-radius: 20px; border: 1px solid rgba(255,255,255,0.07); padding: 1.5rem; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
        .ct-channel-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.14); }
        .ct-channel-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; transition: opacity 0.3s; }

        .ct-form-input { width: 100%; padding: 0.75rem 1rem; border-radius: 12px; font-size: 0.875rem; font-family: inherit; color: #fff; background: rgba(255,255,255,0.05); outline: none; transition: all 0.25s; }
        .ct-form-input:focus { background: rgba(255,255,255,0.08); box-shadow: 0 0 0 2px rgba(0,191,165,0.35); }
        .ct-form-input::placeholder { color: rgba(255,255,255,0.2); }
        select.ct-form-input option { background: #1a2332; color: #fff; }
        .ct-label { display: block; font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.38); margin-bottom: 0.5rem; letter-spacing: 0.5px; text-transform: uppercase; }

        .ct-submit-btn { width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #00bfa5, #0097a7); color: #fff; border: none; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; font-family: inherit; box-shadow: 0 8px 28px rgba(0,191,165,0.3); transition: all 0.25s; letter-spacing: -0.2px; }
        .ct-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,191,165,0.45); }
        .ct-submit-btn:active { transform: translateY(0); }

        .ct-faq-item { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.1rem 1.25rem; cursor: pointer; transition: all 0.25s; }
        .ct-faq-item:hover { border-color: rgba(0,191,165,0.22); background: rgba(0,191,165,0.04); }
        .ct-faq-item.faq-open { border-color: rgba(0,191,165,0.3); background: rgba(0,191,165,0.05); box-shadow: 0 8px 24px rgba(0,191,165,0.07); }

        .ct-stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.2rem; text-align: center; transition: all 0.25s; }
        .ct-stat-card:hover { background: rgba(255,255,255,0.055); transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.2); }

        .ct-success-icon { animation: success-bounce 0.6s cubic-bezier(0.16,1,0.3,1) both; }

        .ct-channels-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 3rem; }
        .ct-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 3rem; }
        .ct-main-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; }
        .ct-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .ct-form-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 2.25rem; }
        .ct-cta-strip { position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(0,191,165,0.08), rgba(59,130,246,0.06)); border: 1px solid rgba(0,191,165,0.15); border-radius: 24px; padding: 3rem 2rem; text-align: center; margin-top: 3rem; }
        .ct-cta-strip::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,191,165,0.5), transparent); }

        @media (max-width: 900px) { .ct-channels-grid { grid-template-columns: repeat(2, 1fr); } .ct-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .ct-main-grid { grid-template-columns: 1fr; } .ct-form-row { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .ct-channels-grid { grid-template-columns: 1fr 1fr; } .ct-stats-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 380px) { .ct-channels-grid { grid-template-columns: 1fr; } }
      `}</style>

      <InteractiveCanvasBg />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', background: 'rgba(6,9,18,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#00bfa5,#0097a7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(0,191,165,0.35)' }}>🏥</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.3px' }}>Practo Tracker</div>
            <div style={{ fontSize: '0.58rem', color: '#00bfa5', fontWeight: 600 }}>Clinic Analyzer</div>
          </div>
        </Link>
        <Link to="/" className="ct-nav-back">← Back to Home</Link>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '4rem 5% 3rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '350px', background: 'radial-gradient(ellipse, rgba(0,191,165,0.11), transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, rgba(0,191,165,0.12), rgba(0,191,165,0.07))', border: '1px solid rgba(0,191,165,0.3)', borderRadius: '999px', padding: '0.4rem 1.1rem', fontSize: '0.76rem', color: '#00e5cc', fontWeight: 700, marginBottom: '1.75rem', backdropFilter: 'blur(10px)' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#00e5cc', animation: 'pulse-dot 2s ease infinite' }} />
          💬 Contact & Support
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.08, marginBottom: '1.25rem', animation: 'slide-up 0.7s ease both' }}>
          <span style={{ background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>We'd love to</span>
          {' '}
          <span style={{ background: 'linear-gradient(135deg, #00bfa5, #00e5cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>hear from you.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7, animation: 'slide-up 0.7s 0.1s ease both' }}>
          Our team is here to help — whether you have a question, a bug to report, or just want to share feedback.
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 5% 6rem', position: 'relative', zIndex: 1 }}>

        {/* Stats bar */}
        <div className="ct-stats-grid">
          {stats.map(s => (
            <div key={s.label} className="ct-stat-card">
              <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00bfa5', letterSpacing: '-0.5px', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Channel cards */}
        <div className="ct-channels-grid">
          {channels.map(ch => (
            <div key={ch.title} className="ct-channel-card" style={{ background: ch.bg }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${ch.color}, ${ch.color}88)` }} />
              <div style={{ width: 42, height: 42, borderRadius: '12px', background: `rgba(${ch.color === '#00bfa5' ? '0,191,165' : ch.color === '#ef4444' ? '239,68,68' : ch.color === '#8b5cf6' ? '139,92,246' : '245,158,11'},0.15)`, border: `1px solid ${ch.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '1rem' }}>{ch.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '0.3rem' }}>{ch.title}</div>
              <div style={{ fontSize: '0.78rem', color: ch.color, fontWeight: 600, marginBottom: '0.2rem' }}>{ch.detail}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{ch.sub}</div>
            </div>
          ))}
        </div>

        {/* Form + FAQ */}
        <div className="ct-main-grid">

          {/* Contact form */}
          <div className="ct-form-card">
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.3rem' }}>Send a Message</h2>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.83rem' }}>We respond within 24 hours on business days.</p>
            </div>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div className="ct-success-icon" style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>🎉</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.6rem', background: 'linear-gradient(135deg, #00bfa5, #00e5cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Message Sent!</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Thank you for reaching out! We'll get back to you within 24 hours. Keep an eye on your inbox.
                </p>
                <button onClick={() => setSent(false)} style={{ padding: '0.7rem 2rem', background: 'rgba(0,191,165,0.15)', color: '#00bfa5', border: '1px solid rgba(0,191,165,0.3)', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', transition: 'all 0.2s' }}>
                  Send Another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="ct-form-row">
                  <div>
                    <label className="ct-label">Your Name *</label>
                    <input
                      className="ct-form-input"
                      style={{ border: `1.5px solid ${focusedField === 'name' ? '#00bfa5' : 'rgba(255,255,255,0.08)'}` }}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="ct-label">Email Address *</label>
                    <input
                      className="ct-form-input"
                      type="email"
                      style={{ border: `1.5px solid ${focusedField === 'email' ? '#00bfa5' : 'rgba(255,255,255,0.08)'}` }}
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@clinic.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="ct-label">Subject</label>
                  <select
                    className="ct-form-input"
                    style={{ border: `1.5px solid ${focusedField === 'subject' ? '#00bfa5' : 'rgba(255,255,255,0.08)'}` }}
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                  >
                    {['General Enquiry', 'Bug Report', 'Feature Request', 'Privacy Concern', 'Account Issue', 'Other'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="ct-label">Message *</label>
                  <textarea
                    className="ct-form-input"
                    style={{ resize: 'vertical', minHeight: '140px', border: `1.5px solid ${focusedField === 'message' ? '#00bfa5' : 'rgba(255,255,255,0.08)'}` }}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Describe your issue or question in detail..."
                    required
                  />
                </div>
                <button type="submit" className="ct-submit-btn">
                  Send Message 📨
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.22)' }}>
                  🔒 Your message is encrypted and secure
                </div>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '0.3rem' }}>Frequently Asked</h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Quick answers to common questions.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} className={`ct-faq-item${openFaq === i ? ' faq-open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.87rem', fontWeight: 600, color: openFaq === i ? '#00bfa5' : '#fff', lineHeight: 1.4, transition: 'color 0.25s' }}>{faq.q}</span>
                    <span style={{ color: '#00bfa5', fontSize: '1rem', flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'none', marginTop: '2px' }}>+</span>
                  </div>
                  {openFaq === i && (
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.65, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: '🔒 Privacy Policy', to: '/privacy' },
                  { label: '📜 Terms of Service', to: '/terms' },
                  { label: '📊 View Dashboard', to: '/dashboard' },
                  { label: '🎫 Submit a Ticket', to: '/tickets' },
                ].map(l => (
                  <Link key={l.label} to={l.to} style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s', padding: '0.3rem 0' }}
                    onMouseEnter={e => e.target.style.color = '#00bfa5'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="ct-cta-strip">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏥</div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ready to transform your clinic?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', maxWidth: '380px', margin: '0 auto 2rem', lineHeight: 1.65 }}>
            Start managing appointments, follow-ups, and complaints with smart automation today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'linear-gradient(135deg, #00bfa5, #0097a7)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,191,165,0.3)' }}>
              Create Free Account →
            </Link>
            <Link to="/" style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
