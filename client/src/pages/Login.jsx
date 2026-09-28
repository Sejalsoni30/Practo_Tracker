import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <Link to="/" style={styles.backBtn}>← Back to home</Link>
          <div style={styles.brand}>
            <span style={{ fontSize: '2.5rem' }}>🏥</span>
            <div>
              <div style={styles.brandName}>Practo Tracker</div>
              <div style={styles.brandSub}>Clinic Follow-up Analyzer</div>
            </div>
          </div>

          <div style={styles.testimonial}>
            <div style={styles.quote}>"Practo Tracker cut our missed follow-ups by 80%. The priority system is a game-changer for our team."</div>
            <div style={styles.quotePerson}>— Dr. Ayesha Khan, Senior Cardiologist</div>
          </div>

          <div style={styles.features}>
            {['✅ Smart missed appointment detection', '✅ Auto-priority (High / Medium / Low)', '✅ One-click CSV reports', '✅ Complaint & ticket management'].map(f => (
              <div key={f} style={styles.featureItem}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.right}>
        <div style={styles.form}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={styles.title}>Welcome back</h1>
            <p style={styles.sub}>Sign in to your clinic dashboard</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                required
                autoFocus
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={styles.label}>Password</label>
                <button type="button" onClick={() => setShowPass(!showPass)} style={styles.showBtn}>{showPass ? 'Hide' : 'Show'}</button>
              </div>
              <input
                style={styles.input}
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>Create one free →</Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#a0aec0', marginTop: '1.5rem' }}>
            By signing in you agree to our <span style={{ color: '#00bfa5' }}>Terms of Service</span> and <span style={{ color: '#00bfa5' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  left: { flex: 1, background: 'linear-gradient(135deg, #0d1117 0%, #1a2332 50%, #0d2137 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' },
  leftInner: { maxWidth: '440px', width: '100%' },
  backBtn: { display: 'inline-block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '2.5rem', transition: 'color 0.2s' },
  brand: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' },
  brandName: { fontSize: '1.3rem', fontWeight: 800, color: '#00bfa5' },
  brandSub: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' },
  testimonial: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' },
  quote: { fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1rem' },
  quotePerson: { fontSize: '0.8rem', color: '#00bfa5', fontWeight: 600 },
  features: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  featureItem: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' },
  right: { flex: 1, background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' },
  form: { width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' },
  title: { fontSize: '1.8rem', fontWeight: 800, color: '#1a202c', margin: 0 },
  sub: { color: '#718096', fontSize: '0.9rem', marginTop: '0.35rem' },
  errorBox: { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  label: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', color: '#1a202c', background: '#f7fafc', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' },
  showBtn: { background: 'none', border: 'none', color: '#00bfa5', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 },
  btn: { width: '100%', padding: '0.85rem', background: '#00bfa5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s, transform 0.1s', fontFamily: 'inherit' },
  divider: { display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' },
  dividerLine: { flex: 1, height: '1px', background: '#e2e8f0' },
  dividerText: { fontSize: '0.8rem', color: '#a0aec0' },
  switchText: { textAlign: 'center', fontSize: '0.875rem', color: '#718096' },
  link: { color: '#00bfa5', fontWeight: 700, textDecoration: 'none' },
};