import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InteractiveCanvasBg from '../components/InteractiveCanvasBg';

const sections = [
  {
    icon: '✅',
    color: '#3b82f6',
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using Practo Tracker, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
      'If you do not agree with any of these terms, you are prohibited from using or accessing this platform.',
      'These terms apply to all users of the service including clinic staff, administrators, and viewers.',
    ],
  },
  {
    icon: '📜',
    color: '#00bfa5',
    title: '2. Use License',
    content: [
      'Permission is granted to use Practo Tracker for personal, internal clinic management purposes.',
      'You may not attempt to decompile, reverse engineer, or extract the source code of the software.',
      'You may not use the service to transmit any harmful, unlawful, or offensive content.',
      'This license is automatically revoked if you violate any of these restrictions.',
    ],
  },
  {
    icon: '🔑',
    color: '#8b5cf6',
    title: '3. Account Responsibilities',
    content: [
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You agree to notify us immediately of any unauthorized use of your account.',
      'All activities that occur under your account are your responsibility.',
      'You must provide accurate and up-to-date information during registration.',
    ],
  },
  {
    icon: '🩺',
    color: '#f59e0b',
    title: '4. Patient Data Handling',
    content: [
      'You agree to handle patient data in compliance with applicable healthcare data protection laws (such as DPDP Act 2023 in India).',
      'Practo Tracker provides tools; the responsibility for appropriate data handling lies with the clinic operator.',
      'Do not enter more patient information than necessary for appointment management purposes.',
      'Patient data must not be shared with unauthorized parties through the platform.',
    ],
  },
  {
    icon: '⚡',
    color: '#10b981',
    title: '5. Service Availability',
    content: [
      'We strive for 99% uptime but do not guarantee uninterrupted access to the service.',
      'Scheduled maintenance will be communicated in advance when possible.',
      'We reserve the right to modify or discontinue the service with reasonable notice.',
    ],
  },
  {
    icon: '💡',
    color: '#ec4899',
    title: '6. Intellectual Property',
    content: [
      'The Practo Tracker name, logo, and all platform content are the intellectual property of their respective owners.',
      'You retain ownership of data you enter into the platform.',
      'By submitting content, you grant us a limited license to store and display it as part of providing the service.',
    ],
  },
  {
    icon: '⚠️',
    color: '#ef4444',
    title: '7. Limitation of Liability',
    content: [
      'Practo Tracker shall not be liable for any indirect, incidental, or consequential damages arising from use of the service.',
      'We are not responsible for errors in medical data entered by users.',
      'In no event shall our liability exceed the amount you paid for the service in the past 12 months.',
    ],
  },
  {
    icon: '🚪',
    color: '#06b6d4',
    title: '8. Termination',
    content: [
      'We may terminate or suspend your account immediately, without prior notice, for conduct that violates these Terms.',
      'You may terminate your account at any time by contacting our support team.',
      'Upon termination, your right to use the service ceases immediately.',
    ],
  },
  {
    icon: '⚖️',
    color: '#f97316',
    title: '9. Governing Law',
    content: [
      'These terms shall be governed by and construed in accordance with the laws of India.',
      'Any disputes arising shall be subject to the exclusive jurisdiction of courts in India.',
    ],
  },
  {
    icon: '🔄',
    color: '#a78bfa',
    title: '10. Changes to Terms',
    content: [
      'We reserve the right to modify these terms at any time.',
      'Changes will be notified via email or in-app notification.',
      'Continued use of the platform after changes signifies acceptance of the new terms.',
    ],
  },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function Terms() {
  const [openSection, setOpenSection] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#060912', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060912; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #3b82f6, #1d4ed8); border-radius: 3px; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

        .trm-section { border-radius: 20px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.025); transition: all 0.3s cubic-bezier(0.16,1,0.3,1); overflow: hidden; cursor: pointer; margin-bottom: 1rem; }
        .trm-section:hover { border-color: rgba(255,255,255,0.13); background: rgba(255,255,255,0.04); transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,0,0,0.3); }
        .trm-section.open { border-color: rgba(59,130,246,0.25); background: rgba(59,130,246,0.04); box-shadow: 0 20px 50px rgba(59,130,246,0.07); }
        .trm-header { display: flex; align-items: center; gap: 1rem; padding: 1.4rem 1.5rem; }
        .trm-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
        .trm-chevron { margin-left: auto; font-size: 0.9rem; flex-shrink: 0; transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); color: rgba(255,255,255,0.3); }
        .trm-chevron.open { transform: rotate(180deg); color: #60a5fa; }
        .trm-body { padding: 0 1.5rem 1.5rem 4.5rem; }
        .trm-li { display: flex; gap: 0.75rem; align-items: flex-start; font-size: 0.875rem; color: rgba(255,255,255,0.56); line-height: 1.7; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.04); animation: slide-up 0.3s ease both; }
        .trm-li:last-child { border-bottom: none; }
        .trm-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 8px; flex-shrink: 0; }

        .trm-nav-back { display: inline-flex; align-items: center; padding: 0.5rem 1.1rem; border-radius: 10px; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.8); font-size: 0.82rem; font-weight: 600; text-decoration: none; border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; }
        .trm-nav-back:hover { background: rgba(255,255,255,0.13); color: #fff; }

        .trm-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .trm-pill { padding: 0.35rem 0.9rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.45); }
        .trm-pill:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.7); }
        .trm-pill.active { background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.35); color: #60a5fa; }

        .trm-toc { background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.12); border-radius: 16px; padding: 1.5rem; margin-bottom: 2.5rem; }
        .trm-toc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem; margin-top: 0.75rem; }
        .trm-toc-item { font-size: 0.75rem; color: rgba(255,255,255,0.4); padding: 0.3rem 0.6rem; border-radius: 7px; background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.2s; }
        .trm-toc-item:hover { color: #60a5fa; background: rgba(59,130,246,0.1); }

        .trm-cta-strip { position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(59,130,246,0.09), rgba(139,92,246,0.07)); border: 1px solid rgba(59,130,246,0.15); border-radius: 24px; padding: 3rem 2rem; text-align: center; margin-top: 3rem; }
        .trm-cta-strip::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent); }

        .trm-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap: 1rem; margin-bottom: 3rem; }
        .trm-info-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.25rem; text-align: center; transition: all 0.25s; }
        .trm-info-card:hover { background: rgba(255,255,255,0.055); transform: translateY(-3px); border-color: rgba(59,130,246,0.2); box-shadow: 0 12px 30px rgba(0,0,0,0.2); }

        @media (max-width: 768px) { .trm-body { padding: 0 1rem 1.25rem 1rem; } .trm-header { padding: 1.25rem 1rem; gap: 0.75rem; } }
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
        <Link to="/" className="trm-nav-back">← Back to Home</Link>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '4rem 5% 3rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(59,130,246,0.13), transparent)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.07))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '999px', padding: '0.4rem 1.1rem', fontSize: '0.76rem', color: '#60a5fa', fontWeight: 700, marginBottom: '1.75rem', backdropFilter: 'blur(10px)' }}>
          <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#60a5fa', animation: 'pulse-dot 2s ease infinite' }} />
          📜 Terms of Service — Last updated September 2026
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.08, marginBottom: '1.25rem', animation: 'slide-up 0.7s ease both' }}>
          <span style={{ background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Terms of</span>
          {' '}
          <span style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Service.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7, animation: 'slide-up 0.7s 0.1s ease both' }}>
          Please read these terms carefully before using Practo Tracker. By using the platform, you agree to be bound by these terms.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 5% 6rem', position: 'relative', zIndex: 1 }}>

        {/* Info highlights */}
        <div className="trm-info-grid">
          {[
            { icon: '🏛️', label: 'Governed by Indian law', color: '#3b82f6' },
            { icon: '🔐', label: 'Secure JWT auth required', color: '#8b5cf6' },
            { icon: '🩺', label: 'DPDP Act 2023 compliant', color: '#10b981' },
            { icon: '📊', label: '99% uptime target', color: '#f59e0b' },
          ].map(h => (
            <div key={h.label} className="trm-info-card">
              <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{h.icon}</div>
              <div style={{ fontSize: '0.78rem', color: h.color, fontWeight: 700 }}>{h.label}</div>
            </div>
          ))}
        </div>

        {/* Table of contents */}
        <div className="trm-toc">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📑 Quick Navigation
          </div>
          <div className="trm-toc-grid">
            {sections.map((s, i) => (
              <div key={i} className="trm-toc-item" onClick={() => setOpenSection(i)}>
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Accordion sections */}
        {sections.map((sec, i) => (
          <div
            key={i}
            className={`trm-section${openSection === i ? ' open' : ''}`}
            onClick={() => setOpenSection(openSection === i ? null : i)}
          >
            <div className="trm-header">
              <div className="trm-icon" style={{ background: `rgba(${hexToRgb(sec.color)}, 0.13)`, border: `1px solid rgba(${hexToRgb(sec.color)}, 0.22)` }}>
                {sec.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: openSection === i ? sec.color : '#fff', transition: 'color 0.25s' }}>{sec.title}</div>
                <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.28)', marginTop: '2px' }}>{sec.content.length} clause{sec.content.length > 1 ? 's' : ''} · click to {openSection === i ? 'collapse' : 'expand'}</div>
              </div>
              <div className={`trm-chevron${openSection === i ? ' open' : ''}`}>▼</div>
            </div>
            {openSection === i && (
              <div className="trm-body">
                {sec.content.map((line, j) => (
                  <div key={j} className="trm-li" style={{ animationDelay: `${j * 60}ms` }}>
                    <div className="trm-dot" style={{ background: sec.color }} />
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* CTA strip */}
        <div className="trm-cta-strip">
          <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>⚖️</div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Have a question about our terms?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 2rem', lineHeight: 1.65 }}>
            Our support team is happy to clarify any clause or address your concerns directly.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>Contact Support →</Link>
            <Link to="/privacy" style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>Privacy Policy</Link>
            <Link to="/" style={{ padding: '0.75rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.07)' }}>← Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
