import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import '../styles/index.css';

const steps = ['Account Info', 'Set Password', 'Done!'];

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const nextStep = (e) => {
    e.preventDefault();
    setError('');
    if (step === 0) {
      if (!form.name.trim() || !form.email.trim()) return setError('Please fill in all fields.');
      setStep(1);
    } else if (step === 1) {
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
      if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
      handleRegister();
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await API.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setStep(1);
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

          {/* Steppers */}
          <div style={{ marginBottom: '2.5rem' }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                  background: i < step ? '#00bfa5' : i === step ? 'rgba(0,191,165,0.2)' : 'rgba(255,255,255,0.07)',
                  border: i === step ? '2px solid #00bfa5' : '2px solid transparent',
                  color: i <= step ? '#00bfa5' : 'rgba(255,255,255,0.3)'
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: i <= step ? '#fff' : 'rgba(255,255,255,0.35)' }}>{s}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                    {i === 0 ? 'Name & email' : i === 1 ? 'Secure password' : 'Access granted'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(0,191,165,0.1)', border: '1px solid rgba(0,191,165,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#00bfa5', fontWeight: 700, marginBottom: '0.5rem' }}>🔒 Your data is secure</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              All passwords are hashed with bcrypt. Your clinic data is stored securely and never shared.
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.right}>
        <div style={styles.formBox}>
          {step < 2 ? (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <div style={styles.stepIndicator}>Step {step + 1} of 2</div>
                <h1 style={styles.title}>{step === 0 ? 'Create your account' : 'Set your password'}</h1>
                <p style={styles.sub}>{step === 0 ? 'Start managing your clinic in minutes' : 'Choose a strong, secure password'}</p>
              </div>

              {/* Progress bar */}
              <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '4px', marginBottom: '2rem', overflow: 'hidden' }}>
                <div style={{ width: step === 0 ? '50%' : '100%', height: '100%', background: '#00bfa5', borderRadius: '999px', transition: 'width 0.4s ease' }} />
              </div>

              {error && <div style={styles.errorBox}>⚠️ {error}</div>}

              <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {step === 0 && (
                  <>
                    <div>
                      <label style={styles.label}>Full Name</label>
                      <input style={styles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Dr. John Doe" required autoFocus />
                    </div>
                    <div>
                      <label style={styles.label}>Work Email</label>
                      <input style={styles.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@clinic.com" required />
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <div>
                      <label style={styles.label}>Password</label>
                      <input style={styles.input} type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" required autoFocus />
                      {form.password && (
                        <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                          {[1,2,3,4].map(i => (
                            <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: form.password.length >= i * 3 ? (form.password.length >= 10 ? '#38a169' : '#dd6b20') : '#e2e8f0' }} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={styles.label}>Confirm Password</label>
                      <input style={styles.input} type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Re-enter password" required />
                      {form.confirmPassword && (
                        <div style={{ fontSize: '0.75rem', marginTop: '4px', color: form.password === form.confirmPassword ? '#38a169' : '#e53e3e' }}>
                          {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <button type="submit" style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn} disabled={loading}>
                  {loading ? 'Creating account...' : step === 0 ? 'Continue →' : 'Create Account →'}
                </button>
              </form>

              <p style={styles.switchText}>
                Already have an account? <Link to="/login" style={styles.link}>Sign in →</Link>
              </p>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>Account Created!</h2>
              <p style={{ color: '#718096', marginBottom: '0.25rem' }}>Welcome to Practo Tracker, <strong>{form.name}</strong>!</p>
              <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '2rem' }}>Your account has been set up successfully.</p>
              <button onClick={() => navigate('/login')} style={{ ...styles.btn, padding: '0.85rem 2rem' }}>
                Go to Login →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  left: { flex: 1, background: 'linear-gradient(135deg, #0d1117 0%, #1a2332 50%, #0d2137 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' },
  leftInner: { maxWidth: '420px', width: '100%' },
  backBtn: { display: 'inline-block', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '2.5rem' },
  brand: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' },
  brandName: { fontSize: '1.3rem', fontWeight: 800, color: '#00bfa5' },
  brandSub: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' },
  right: { flex: 1, background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' },
  formBox: { width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' },
  stepIndicator: { display: 'inline-block', background: 'rgba(0,191,165,0.1)', color: '#00bfa5', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px', marginBottom: '0.75rem' },
  title: { fontSize: '1.8rem', fontWeight: 800, color: '#1a202c', margin: 0 },
  sub: { color: '#718096', fontSize: '0.9rem', marginTop: '0.35rem' },
  errorBox: { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.875rem', marginBottom: '0.75rem' },
  label: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', color: '#1a202c', background: '#f7fafc', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '0.85rem', background: '#00bfa5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' },
  switchText: { textAlign: 'center', fontSize: '0.875rem', color: '#718096', marginTop: '1.5rem' },
  link: { color: '#00bfa5', fontWeight: 700, textDecoration: 'none' },
};