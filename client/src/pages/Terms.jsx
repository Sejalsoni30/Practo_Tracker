import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import InteractiveCanvasBg from '../components/InteractiveCanvasBg';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By accessing or using Practo Tracker, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
      'If you do not agree with any of these terms, you are prohibited from using or accessing this platform.',
      'These terms apply to all users of the service including clinic staff, administrators, and viewers.',
    ],
  },
  {
    title: '2. Use License',
    content: [
      'Permission is granted to use Practo Tracker for personal, internal clinic management purposes.',
      'You may not attempt to decompile, reverse engineer, or extract the source code of the software.',
      'You may not use the service to transmit any harmful, unlawful, or offensive content.',
      'This license is automatically revoked if you violate any of these restrictions.',
    ],
  },
  {
    title: '3. Account Responsibilities',
    content: [
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You agree to notify us immediately of any unauthorized use of your account.',
      'All activities that occur under your account are your responsibility.',
      'You must provide accurate and up-to-date information during registration.',
    ],
  },
  {
    title: '4. Patient Data Handling',
    content: [
      'You agree to handle patient data in compliance with applicable healthcare data protection laws (such as DPDP Act 2023 in India).',
      'Practo Tracker provides tools; the responsibility for appropriate data handling lies with the clinic operator.',
      'Do not enter more patient information than necessary for appointment management purposes.',
      'Patient data must not be shared with unauthorized parties through the platform.',
    ],
  },
  {
    title: '5. Service Availability',
    content: [
      'We strive for 99% uptime but do not guarantee uninterrupted access to the service.',
      'Scheduled maintenance will be communicated in advance when possible.',
      'We reserve the right to modify or discontinue the service with reasonable notice.',
    ],
  },
  {
    title: '6. Intellectual Property',
    content: [
      'The Practo Tracker name, logo, and all platform content are the intellectual property of their respective owners.',
      'You retain ownership of data you enter into the platform.',
      'By submitting content, you grant us a limited license to store and display it as part of providing the service.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    content: [
      'Practo Tracker shall not be liable for any indirect, incidental, or consequential damages arising from use of the service.',
      'We are not responsible for errors in medical data entered by users.',
      'In no event shall our liability exceed the amount you paid for the service in the past 12 months.',
    ],
  },
  {
    title: '8. Termination',
    content: [
      'We may terminate or suspend your account immediately, without prior notice, for conduct that violates these Terms.',
      'You may terminate your account at any time by contacting our support team.',
      'Upon termination, your right to use the service ceases immediately.',
    ],
  },
  {
    title: '9. Governing Law',
    content: [
      'These terms shall be governed by and construed in accordance with the laws of India.',
      'Any disputes arising shall be subject to the exclusive jurisdiction of courts in India.',
    ],
  },
  {
    title: '10. Changes to Terms',
    content: [
      'We reserve the right to modify these terms at any time.',
      'Changes will be notified via email or in-app notification.',
      'Continued use of the platform after changes signifies acceptance of the new terms.',
    ],
  },
];

export default function Terms() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#060912', color: '#fff', minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #00bfa5; border-radius: 3px; }`}</style>
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600, marginBottom: '1.5rem' }}>📜 Terms of Service</div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem', background: 'linear-gradient(135deg,#fff,rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Terms of Service</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>Last updated: September 2026. Please read these terms carefully before using Practo Tracker.</p>
      </div>

      {/* Quick jump */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 5% 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.75rem' }}>📑 Quick Navigation</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {sections.map((s, i) => (
              <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.65rem', borderRadius: '6px', color: 'rgba(255,255,255,0.5)', cursor: 'default' }}>{s.title.split('.')[0]}. {s.title.split('. ')[1]}</span>
            ))}
          </div>
        </div>

        {sections.map((sec, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '2rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#60a5fa', marginBottom: '1rem' }}>{sec.title}</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sec.content.map((line, j) => (
                <li key={j} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  <span style={{ color: '#60a5fa', marginTop: '4px', flexShrink: 0 }}>•</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Footer links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ color: '#00bfa5', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy →</Link>
          <Link to="/contact" style={{ color: '#00bfa5', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Contact Us →</Link>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
