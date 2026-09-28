import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InteractiveCanvasBg from '../components/InteractiveCanvasBg';

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'When you register on Practo Tracker, we collect your name, email address, and a securely hashed password.',
      'We collect clinic data you enter including appointment records, patient names, doctor details, complaints, and service tickets.',
      'We do not collect sensitive personal health data beyond what you voluntarily enter into the system.',
      'We may collect usage analytics such as page views and feature usage to improve the platform.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'Your information is used solely to provide and improve the Practo Tracker clinic management service.',
      'We use your email address to send account-related notifications and important system updates.',
      'We do not sell, rent, or trade your personal information to third parties under any circumstances.',
      'Anonymized, aggregated data may be used for internal analytics and product improvement.',
    ],
  },
  {
    title: '3. Data Security',
    content: [
      'All passwords are hashed using bcrypt with salt rounds — plain text passwords are never stored.',
      'All data is transmitted over HTTPS/TLS encrypted connections.',
      'Access to data is controlled via JWT (JSON Web Token) authentication with expiry.',
      'We regularly review our security practices to ensure your data stays protected.',
    ],
  },
  {
    title: '4. Cookies',
    content: [
      'Practo Tracker uses minimal cookies to maintain your login session.',
      'We do not use tracking cookies or advertising cookies.',
      'You can clear cookies at any time via your browser settings without losing your account.',
    ],
  },
  {
    title: '5. Data Retention',
    content: [
      'Your data is retained as long as your account is active.',
      'You may request deletion of your account and associated data at any time by contacting us.',
      'Upon deletion, your data will be permanently removed from our servers within 30 days.',
    ],
  },
  {
    title: '6. Third-Party Services',
    content: [
      'Practo Tracker may use MongoDB Atlas for secure cloud database storage.',
      'We do not integrate advertising networks or social media tracking pixels.',
      'Any third-party service we use is bound by their own privacy policies and is carefully vetted.',
    ],
  },
  {
    title: '7. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices.',
      'When we make significant changes, we will notify you via email or a prominent notice on the app.',
      'Continued use of the platform after changes constitutes your acceptance of the updated policy.',
    ],
  },
  {
    title: '8. Contact Us',
    content: [
      'If you have any questions or concerns about this Privacy Policy, please contact us at privacy@practotracker.com.',
      'You can also visit our Contact page for more ways to reach us.',
    ],
  },
];

export default function Privacy() {
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,191,165,0.1)', border: '1px solid rgba(0,191,165,0.25)', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.78rem', color: '#00bfa5', fontWeight: 600, marginBottom: '1.5rem' }}>🔒 Privacy Policy</div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem', background: 'linear-gradient(135deg,#fff,rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Privacy Matters</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>Last updated: September 2026. We are committed to protecting your personal information and your right to privacy.</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 5% 6rem', position: 'relative', zIndex: 1 }}>
        {sections.map((sec, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '2rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#00bfa5', marginBottom: '1rem' }}>{sec.title}</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sec.content.map((line, j) => (
                <li key={j} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  <span style={{ color: '#00bfa5', marginTop: '4px', flexShrink: 0 }}>•</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Footer links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: '#00bfa5', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service →</Link>
          <Link to="/contact" style={{ color: '#00bfa5', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>Contact Us →</Link>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
