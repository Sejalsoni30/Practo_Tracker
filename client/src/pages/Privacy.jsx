import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InteractiveCanvasBg from '../components/InteractiveCanvasBg';

const sections = [
  {
    icon: '📋',
    color: '#3b82f6',
    title: '1. Information We Collect',
    content: [
      'When you register on Practo Tracker, we collect your name, email address, and a securely hashed password.',
      'We collect clinic data you enter including appointment records, patient names, doctor details, complaints, and service tickets.',
      'We do not collect sensitive personal health data beyond what you voluntarily enter into the system.',
      'We may collect usage analytics such as page views and feature usage to improve the platform.',
    ],
  },
  {
    icon: '⚙️',
    color: '#00bfa5',
    title: '2. How We Use Your Information',
    content: [
      'Your information is used solely to provide and improve the Practo Tracker clinic management service.',
      'We use your email address to send account-related notifications and important system updates.',
      'We do not sell, rent, or trade your personal information to third parties under any circumstances.',
      'Anonymized, aggregated data may be used for internal analytics and product improvement.',
    ],
  },
  {
    icon: '🔒',
    color: '#8b5cf6',
    title: '3. Data Security',
    content: [
      'All passwords are hashed using bcrypt with salt rounds — plain text passwords are never stored.',
      'All data is transmitted over HTTPS/TLS encrypted connections.',
      'Access to data is controlled via JWT (JSON Web Token) authentication with expiry.',
      'We regularly review our security practices to ensure your data stays protected.',
    ],
  },
  {
    icon: '🍪',
    color: '#f59e0b',
    title: '4. Cookies',
    content: [
      'Practo Tracker uses minimal cookies to maintain your login session.',
      'We do not use tracking cookies or advertising cookies.',
      'You can clear cookies at any time via your browser settings without losing your account.',
    ],
  },
  {
    icon: '🗂️',
    color: '#ec4899',
    title: '5. Data Retention',
    content: [
      'Your data is retained as long as your account is active.',
      'You may request deletion of your account and associated data at any time by contacting us.',
      'Upon deletion, your data will be permanently removed from our servers within 30 days.',
    ],
  },
  {
    icon: '🔗',
    color: '#06b6d4',
    title: '6. Third-Party Services',
    content: [
      'Practo Tracker may use MongoDB Atlas for secure cloud database storage.',
      'We do not integrate advertising networks or social media tracking pixels.',
      'Any third-party service we use is bound by their own privacy policies and is carefully vetted.',
    ],
  },
  {
    icon: '📝',
    color: '#10b981',
    title: '7. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices.',
      'When we make significant changes, we will notify you via email or a prominent notice on the app.',
      'Continued use of the platform after changes constitutes your acceptance of the updated policy.',
    ],
  },
  {
    icon: '💬',
    color: '#f97316',
    title: '8. Contact Us',
    content: [
      'If you have any questions or concerns about this Privacy Policy, please contact us at privacy@practotracker.com.',
      'You can also visit our Contact page for more ways to reach us.',
    ],
  },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function Privacy() {
  const [openSection, setOpenSection] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#060912', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060912; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #00bfa5, #0097a7); border-radius: 3px; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .prv-section { border-radius: 20px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.028); transition: all 0.3s cubic-bezier(0.16,1,0.3,1); overflow: hidden; cursor: pointer; margin-bottom: 1rem; }
        .prv-section:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.045); transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
        .prv-section.open { border-color: rgba(0,191,165,0.25); background: rgba(0,191,165,0.04); box-shadow: 0 20px 50px rgba(0,191,165,0.08); }
        .prv-header { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; }
        .prv-icon { width: 46px; height: 46px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; flex-shrink: 0; }
        .prv-chevron { margin-left: auto; font-size: 1rem; flex-shrink: 0; transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); color: rgba(255,255,255,0.35); }
        .prv-chevron.open { transform: rotate(180deg); color: #00bfa5; }
        .prv-body { padding: 0 1.5rem 1.5rem 4.5rem; }
        .prv-li { display: flex; gap: 0.75rem; align-items: flex-start; font-size: 0.88rem; color: rgba(255,255,255,0.58); line-height: 1.7; padding: 0.55rem 0; border-bottom: 1px solid rgba(255,255,255,0.045); animation: slide-up 0.3s ease both; }
        .prv-li:last-child { border-bottom: none; }
        .prv-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 8px; flex-shrink: 0; }
        .prv-highlight-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 1rem; margin-bottom: 3rem; }
        .prv-highlight-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.5rem; text-align: center; transition: all 0.25s ease; }
        .prv-highlight-card:hover { background: rgba(255,255,255,0.055); transform: translateY(-3px); border-color: rgba(0,191,165,0.2); box-shadow: 0 12px 30px rgba(0,0,0,0.25); }
        .prv-nav-back { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.1rem; border-radius: 10px; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.8); font-size: 0.82rem; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; }
        .prv-nav-back:hover { background: rgba(255,255,255,0.13); color: #fff; }
        .prv-cta-strip { position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(0,191,165,0.09), rgba(59,130,246,0.07)); border: 1px solid rgba(0,191,165,0.15); border-radius: 24px; padding: 3rem 2rem; text-align: center; margin-top: 3rem; }
        .prv-cta-strip::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,191,165,0.5), transparent); }
        @media (max-width: 768px) { .prv-body { padding: 0 1rem 1.25rem 1rem; } .prv-header { padding: 1.25rem 1rem; gap: 0.75rem; } .prv-highlight-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .prv-highlight-grid { grid-template-columns: 1fr; } }
      `}</style>

      <InteractiveCanvasBg />

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', background: 'rgba(6,9,18,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <img src="/favicon.png" alt="Practo Tracker Logo" style={{ width: 36, height: 36, borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,191,165,0.35)', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.3px' }}>Practo Tracker</div>
            <div style={{ fontSize: '0.58rem', color: '#00bfa5', fontWeight: 600 }}>Clinic Analyzer</div>
          </div>
        </Link>
        <Link to="/" className="prv-nav-back">← Back to Home</Link>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '4rem 5% 3rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.12), transparent)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.07))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '999px', padding: '0.4rem 1.1rem', fontSize: '0.76rem', color: '#a78bfa', fontWeight: 700, marginBottom: '1.75rem', backdropFilter: 'blur(10px)' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#a78bfa', animation: 'pulse-dot 2s ease infinite' }} />
          🔒 Privacy Policy — Last updated September 2026
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.08, marginBottom: '1.25rem', animation: 'slide-up 0.7s ease both' }}>
          <span style={{ background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Privacy</span>
          {' '}
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Matters.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7, animation: 'slide-up 0.7s 0.1s ease both' }}>
          We are committed to protecting your personal information and your right to privacy. Read below to understand exactly how we handle your data.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 5% 6rem', position: 'relative', zIndex: 1 }}>

        {/* Highlight grid */}
        <div className="prv-highlight-grid">
          {[
            { icon: '🔐', label: 'bcrypt hashed passwords', color: '#8b5cf6' },
            { icon: '🌐', label: 'HTTPS encrypted transfers', color: '#3b82f6' },
            { icon: '🚫', label: 'Zero data selling — ever', color: '#ef4444' },
            { icon: '🗑️', label: 'Delete on request in 30 days', color: '#f59e0b' },
          ].map(h => (
            <div key={h.label} className="prv-highlight-card">
              <div style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{h.icon}</div>
              <div style={{ fontSize: '0.82rem', color: h.color, fontWeight: 700 }}>{h.label}</div>
            </div>
          ))}
        </div>

        {/* Accordion sections */}
        {sections.map((sec, i) => (
          <div
            key={i}
            className={`prv-section${openSection === i ? ' open' : ''}`}
            onClick={() => setOpenSection(openSection === i ? null : i)}
          >
            <div className="prv-header">
              <div className="prv-icon" style={{ background: `rgba(${hexToRgb(sec.color)}, 0.15)`, border: `1px solid rgba(${hexToRgb(sec.color)}, 0.25)` }}>
                {sec.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: openSection === i ? sec.color : '#fff', transition: 'color 0.25s' }}>{sec.title}</div>
                <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.28)', marginTop: '2px' }}>{sec.content.length} points · click to {openSection === i ? 'collapse' : 'expand'}</div>
              </div>
              <div className={`prv-chevron${openSection === i ? ' open' : ''}`}>▼</div>
            </div>
            {openSection === i && (
              <div className="prv-body">
                {sec.content.map((line, j) => (
                  <div key={j} className="prv-li" style={{ animationDelay: `${j * 60}ms` }}>
                    <div className="prv-dot" style={{ background: sec.color }} />
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* CTA strip */}
        <div className="prv-cta-strip">
          <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🛡️</div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Still have questions?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 2rem', lineHeight: 1.65 }}>
            Our team is here to help with any privacy concerns or data requests you may have.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'linear-gradient(135deg, #00bfa5, #0097a7)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,191,165,0.3)' }}>Contact Us →</Link>
            <Link to="/terms" style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>Terms of Service</Link>
            <Link to="/" style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.07)' }}>← Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
