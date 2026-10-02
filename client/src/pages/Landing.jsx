import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/* ─── Interactive Canvas Background ─── */
function InteractiveCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef([]);
  const animRef = useRef(null);

  const PARTICLE_COUNT = 90;
  const CONNECTION_DIST = 140;
  const MOUSE_REPEL_DIST = 120;
  const MOUSE_REPEL_STRENGTH = 0.6;

  const initParticles = useCallback((w, h) => {
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
      hue: Math.random() < 0.6 ? 174 : Math.random() < 0.5 ? 217 : 270, // teal / blue / purple
      alpha: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      const pts = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Update positions
      for (const p of pts) {
        // Mouse repel
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_REPEL_DIST && dist > 0) {
          const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST;
          p.vx += (dx / dist) * force * MOUSE_REPEL_STRENGTH;
          p.vy += (dy / dist) * force * MOUSE_REPEL_STRENGTH;
        }

        // Damping
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.5) { p.vx = (p.vx / speed) * 2.5; p.vy = (p.vy / speed) * 2.5; }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > h) { p.y = h; p.vy *= -1; }

        // Draw particle
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        grd.addColorStop(0, `hsla(${p.hue},80%,65%,${p.alpha})`);
        grd.addColorStop(1, `hsla(${p.hue},80%,65%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DIST) {
            const opacity = (1 - d / CONNECTION_DIST) * 0.35;
            const hue = (pts[i].hue + pts[j].hue) / 2;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `hsla(${hue},70%,60%,${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Mouse glow
      if (mx > 0) {
        const mgrd = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        mgrd.addColorStop(0, 'rgba(0,191,165,0.12)');
        mgrd.addColorStop(1, 'rgba(0,191,165,0)');
        ctx.beginPath();
        ctx.arc(mx, my, 80, 0, Math.PI * 2);
        ctx.fillStyle = mgrd;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ─── Animated counter hook ─── */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 16);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ─── Data ─── */
const features = [
  { icon: '🗓️', title: 'Smart Appointment Booking', desc: 'Schedule consultations with live doctor availability, auto time-slot suggestions, and instant confirmation.', color: '#3b82f6' },
  { icon: '🚨', title: 'Missed Appointment Alerts', desc: 'Automatically detect skipped visits and assign High / Medium / Low priority with one-click next actions.', color: '#ef4444' },
  { icon: '🩺', title: 'Follow-up Tracker', desc: 'Track every patient post-visit. Get overdue warnings, due-today alerts, and suggested follow-up scripts.', color: '#f59e0b' },
  { icon: '📋', title: 'Complaint Management', desc: 'Log patient grievances by category, auto-assign priority, and track resolution from open to closed.', color: '#8b5cf6' },
  { icon: '🎫', title: 'Service Tickets', desc: 'Auto-numbered TKT-XXXX tickets for billing, lab reports, referrals. Overdue tickets highlighted in red.', color: '#ec4899' },
  { icon: '📊', title: 'Analytics & Reports', desc: 'Visual breakdowns of appointment trends, complaint patterns and doctor performance. CSV export in one click.', color: '#10b981' },
  { icon: '🔍', title: 'Global Search', desc: 'Find any patient, appointment, doctor, or complaint across the entire system in milliseconds.', color: '#06b6d4' },
  { icon: '👨‍⚕️', title: 'Doctor Directory', desc: 'Full directory of specialists with availability timings, experience, and real-time slot status.', color: '#00bfa5' },
];

const testimonials = [
  { name: 'Dr. Ayesha Khan', role: 'Senior Cardiologist', text: 'Practo Tracker cut our missed follow-ups by 80%. The auto-priority system is a game changer for our entire team.', avatar: '👩‍⚕️' },
  { name: 'Dr. Rahul Sharma', role: 'Dermatologist', text: 'The complaint management module alone saved us hours each week. Everything is trackable and actionable now.', avatar: '👨‍⚕️' },
  { name: 'Sneha Patel', role: 'Clinic Manager', text: 'Finally a tool built for clinic teams. The dashboard gives us a complete picture in 30 seconds every morning.', avatar: '👩‍💼' },
];

const workflow = [
  { step: '01', title: 'Register your clinic', desc: 'Create your account in under 2 minutes. No credit card required.' },
  { step: '02', title: 'Add doctors & patients', desc: 'Import your team and patient list, or add them one by one.' },
  { step: '03', title: 'Book & track appointments', desc: 'Schedule consultations and let Practo Tracker flag everything that needs attention.' },
  { step: '04', title: 'Act on smart insights', desc: 'Follow priority suggestions, resolve complaints, and download reports instantly.' },
];

/* ─── Blob component ─── */
function Blob({ style }) {
  return <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.18, ...style }} />;
}

/* ─── Feature card ─── */
function FeatureCard({ icon, title, desc, color, index }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `rgba(${hexToRgb(color)},0.08)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? color + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '18px', padding: '1.75rem',
        transition: 'all 0.25s ease',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? `0 20px 40px rgba(${hexToRgb(color)},0.15)` : 'none',
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `rgba(${hexToRgb(color)},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem', border: `1px solid rgba(${hexToRgb(color)},0.25)` }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

/* ─── Dashboard mockup ─── */
function DashboardMockup() {
  return (
    <div style={{ background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', fontFamily: "'Inter',sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: '#1e293b', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        <div style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>Practo Tracker — Dashboard</div>
      </div>
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{ width: '140px', background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1rem 0.75rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
          {['📊 Dashboard', '📅 Appointments', '⚠️ Missed', '🩺 Follow-ups', '📋 Complaints', '🎫 Tickets', '📈 Analytics'].map((item, i) => (
            <div key={item} style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', marginBottom: '2px', background: i === 0 ? '#00bfa520' : 'transparent', color: i === 0 ? '#00bfa5' : 'rgba(255,255,255,0.4)', fontWeight: i === 0 ? 600 : 400 }}>{item}</div>
          ))}
        </div>
        {/* Content */}
        <div style={{ flex: 1, padding: '1rem', background: '#111827' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Good Morning, Dr. Ayesha 👋</div>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {[
              { label: 'Appointments', val: '142', color: '#3b82f6', icon: '📅' },
              { label: 'Missed', val: '7', color: '#ef4444', icon: '⚠️' },
              { label: 'Follow-ups', val: '12', color: '#f59e0b', icon: '🩺' },
              { label: 'Tickets', val: '4', color: '#8b5cf6', icon: '🎫' },
            ].map(c => (
              <div key={c.label} style={{ background: '#1e293b', borderRadius: '8px', padding: '0.6rem', borderTop: `3px solid ${c.color}` }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>{c.icon} {c.label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: c.color, marginTop: '2px' }}>{c.val}</div>
              </div>
            ))}
          </div>
          {/* Table preview */}
          <div style={{ background: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr 0.7fr 0.7fr' }}>
              <span>PATIENT</span><span>DOCTOR</span><span>TIME</span><span>STATUS</span>
            </div>
            {[
              { p: 'Ravi Kapoor', d: 'Dr. Mehta', t: '09:30 AM', s: 'Scheduled', sc: '#3b82f6' },
              { p: 'Priya Singh', d: 'Dr. Khan', t: '10:00 AM', s: 'Completed', sc: '#10b981' },
              { p: 'Amit Joshi', d: 'Dr. Nair', t: '11:30 AM', s: 'Missed', sc: '#ef4444' },
            ].map(row => (
              <div key={row.p} style={{ padding: '0.45rem 0.75rem', fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', display: 'grid', gridTemplateColumns: '1fr 1fr 0.7fr 0.7fr', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>{row.p}</span>
                <span>{row.d}</span>
                <span>{row.t}</span>
                <span style={{ background: `${row.sc}22`, color: row.sc, padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.58rem' }}>{row.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Landing ─── */
export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apptCount, apptRef] = useCounter(1240);
  const [missedCount, missedRef] = useCounter(98);
  const [doctorCount, doctorRef] = useCounter(50);
  const [ticketCount, ticketRef] = useCounter(320);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(t => (t + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: isLight ? '#f0f4f8' : '#060912', color: isLight ? '#1a202c' : '#fff', minHeight: '100vh', overflowX: 'hidden', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${isLight ? '#f0f4f8' : '#060912'}; }
        ::-webkit-scrollbar-thumb { background: #00bfa5; border-radius: 3px; }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 0.7; } 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hero-title { animation: slide-up 0.8s ease both; }
        .hero-sub { animation: slide-up 0.8s 0.15s ease both; }
        .hero-cta { animation: slide-up 0.8s 0.3s ease both; }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .glow-btn:hover { box-shadow: 0 0 30px rgba(0,191,165,0.5), 0 8px 32px rgba(0,191,165,0.35) !important; transform: translateY(-2px); }
        .glow-btn { transition: all 0.25s ease; }
        .nav-link:hover { color: ${isLight ? '#00bfa5' : '#fff'} !important; }
        .badge-pulse::before { content: ''; position: absolute; inset: -4px; border-radius: 999px; border: 2px solid #00bfa5; animation: pulse-ring 2s ease-out infinite; }
        .landing-theme-btn { background: ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}; border: 1px solid ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)'}; border-radius: 8px; color: ${isLight ? '#1a202c' : '#fff'}; width: 38px; height: 38px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; flex-shrink: 0; }
        .landing-theme-btn:hover { background: rgba(0,191,165,0.15); border-color: rgba(0,191,165,0.4); transform: rotate(15deg) scale(1.08); }

        /* Mobile nav */
        .mobile-menu-btn { display: none; background: ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}; border: 1px solid ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)'}; border-radius: 8px; color: ${isLight ? '#1a202c' : '#fff'}; width: 38px; height: 38px; cursor: pointer; font-size: 1.1rem; align-items: center; justify-content: center; }
        .nav-links-desktop { display: flex; align-items: center; gap: 2rem; }
        .nav-links-mobile { display: none; }

        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .nav-links-desktop { display: none; }
          .nav-links-mobile.open { display: flex; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: ${isLight ? 'rgba(240,244,248,0.98)' : 'rgba(6,9,18,0.97)'}; padding: 1rem 5%; gap: 0.5rem; border-bottom: 1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}; z-index: 200; }
          .landing-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .landing-features-grid { grid-template-columns: 1fr !important; }
          .landing-hero-title { font-size: clamp(2rem, 8vw, 3.5rem) !important; }
          .float-anim { animation: none !important; }
          .landing-mockup { transform: none !important; }
        }

        @media (max-width: 480px) {
          .landing-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
          .landing-stats-grid > div { padding: 1rem 0.5rem !important; }
          .landing-stats-grid > div > div:first-child { font-size: 2rem !important; }
        }
      `}</style>

      {/* ── Interactive Canvas Background ── */}
      <InteractiveCanvas />

      {/* ── Navbar ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', background: isLight ? 'rgba(240,244,248,0.92)' : 'rgba(6,9,18,0.85)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}`, flexWrap: 'wrap', gap: '0.5rem', transition: 'background 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#00bfa5,#0097a7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(0,191,165,0.4)' }}>🏥</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.3px', color: isLight ? '#1a202c' : '#fff' }}>Practo Tracker</div>
            <div style={{ fontSize: '0.6rem', color: '#00bfa5', fontWeight: 500, lineHeight: 1 }}>Clinic Analyzer</div>
          </div>
        </div>
        {/* Desktop nav links */}
        <div className="nav-links-desktop">
          {['Features', 'How it works', 'Testimonials'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="nav-link" style={{ color: isLight ? 'rgba(26,32,44,0.6)' : 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>{item}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {/* Theme toggle */}
          <button
            className="landing-theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            id="landing-theme-toggle-btn"
          >
            {isLight ? '🌙' : '☀️'}
          </button>
          <Link to="/login" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', color: isLight ? '#1a202c' : 'rgba(255,255,255,0.75)', fontSize: '0.875rem', fontWeight: 600, border: `1px solid ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}`, textDecoration: 'none', transition: 'all 0.2s' }}>Sign In</Link>
          <Link to="/register" className="glow-btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: 'linear-gradient(135deg,#00bfa5,#0097a7)', color: '#fff', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,191,165,0.35)' }}>Get Started →</Link>
          {/* Mobile hamburger */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Toggle menu">☰</button>
        </div>
        {/* Mobile dropdown links */}
        <div className={`nav-links-mobile ${mobileMenuOpen ? 'open' : ''}`}>
          {['Features', 'How it works', 'Testimonials'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)} style={{ color: isLight ? 'rgba(26,32,44,0.8)' : 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', padding: '0.6rem 0', borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}` }}>{item}</a>
          ))}
          <button
            onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
            style={{ color: isLight ? '#1a202c' : 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', padding: '0.6rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isLight ? '🌙' : '☀️'} {isLight ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '3rem 5% 5rem', maxWidth: '900px', margin: '0 auto' }}>
        <div className="hero-title" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,191,165,0.1)', border: '1px solid rgba(0,191,165,0.25)', borderRadius: '999px', padding: '0.4rem 1.1rem', fontSize: '0.78rem', color: '#00bfa5', fontWeight: 600, marginBottom: '2rem', position: 'relative' }}>
          <span className="badge-pulse" style={{ position: 'relative', display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#00bfa5' }} />
          ✨ Clinic Appointment & Follow-up Analyzer — Now Live
        </div>

        <h1 className="hero-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: '1.75rem' }}>
          <span style={{ background: 'linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.6))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            The Smarter Way<br />to Run Your
          </span>{' '}
          <span style={{ background: 'linear-gradient(135deg, #00bfa5, #00e5cc, #0097a7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shimmer 3s linear infinite', display: 'inline-block' }}>
            Clinic.
          </span>
        </h1>

        <p className="hero-sub" style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: '620px', margin: '0 auto 2.5rem' }}>
          Find missed appointments, prioritize urgent follow-ups, manage complaints & tickets — all automated with{' '}
          <span style={{ color: '#00bfa5', fontWeight: 600 }}>smart priority scoring</span> and{' '}
          <span style={{ color: '#00bfa5', fontWeight: 600 }}>next-action suggestions</span>.
        </p>

        <div className="hero-cta" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <Link to="/register" className="glow-btn" style={{ padding: '0.9rem 2.25rem', borderRadius: '12px', background: 'linear-gradient(135deg,#00bfa5,#0097a7)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,191,165,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Start Free Today <span style={{ fontSize: '1.1rem' }}>→</span>
          </Link>
          <Link to="/login" style={{ padding: '0.9rem 2.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
            View Dashboard 📊
          </Link>
        </div>

        {/* Trust line */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', flexWrap: 'wrap' }}>
          {['✅ No credit card required', '✅ Set up in 2 minutes', '✅ Free forever plan'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 5% 6rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="float-anim" style={{ perspective: '1200px' }}>
          <div style={{ transform: 'rotateX(4deg)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <DashboardMockup />
          </div>
        </div>
        {/* Glow under mockup */}
        <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '80px', background: 'radial-gradient(ellipse,rgba(0,191,165,0.25),transparent)', filter: 'blur(20px)', pointerEvents: 'none' }} />
      </section>

      {/* ── Stats ── */}
      <section style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.025)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '3.5rem 5%' }}>
        <div className="landing-stats-grid" style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
          {[
            { ref: apptRef, val: apptCount, suffix: '+', label: 'Appointments Managed', color: '#3b82f6' },
            { ref: missedRef, val: missedCount, suffix: '%', label: 'Fewer Missed Follow-ups', color: '#00bfa5' },
            { ref: doctorRef, val: doctorCount, suffix: '+', label: 'Doctors Supported', color: '#8b5cf6' },
            { ref: ticketRef, val: ticketCount, suffix: '+', label: 'Tickets Resolved', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} ref={s.ref} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: s.color, letterSpacing: '-1px' }}>{s.val}{s.suffix}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '7rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,191,165,0.1)', border: '1px solid rgba(0,191,165,0.2)', borderRadius: '999px', padding: '0.35rem 1rem', fontSize: '0.75rem', color: '#00bfa5', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.5px' }}>FEATURES</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem' }}>
            Everything your clinic<br />
            <span style={{ background: 'linear-gradient(135deg,#00bfa5,#00e5cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>needs in one place</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>Built from the ground up for clinic management teams who need speed, clarity, and smart automation.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ position: 'relative', zIndex: 1, padding: '7rem 5%', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '999px', padding: '0.35rem 1rem', fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, marginBottom: '1rem' }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, letterSpacing: '-1px' }}>Up and running in minutes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.5rem' }}>
            {workflow.map((w, i) => (
              <div key={w.step} style={{ position: 'relative' }}>
                {i < workflow.length - 1 && <div style={{ position: 'absolute', top: '1.5rem', left: 'calc(100% - 0.5rem)', width: '1rem', height: '1px', background: 'rgba(255,255,255,0.1)', display: 'none' }} />}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#00bfa5', opacity: 0.5, marginBottom: '0.75rem' }}>{w.step}</div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>{w.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" style={{ position: 'relative', zIndex: 1, padding: '7rem 5%', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '999px', padding: '0.4rem 1.25rem', fontSize: '0.75rem', color: '#a78bfa', fontWeight: 700, marginBottom: '3rem', letterSpacing: '0.5px' }}>TESTIMONIALS</div>
        
        <div style={{ position: 'relative', minHeight: '300px', display: 'flex', justifyContent: 'center' }}>
          {testimonials.map((t, i) => (
            <div key={t.name} style={{ 
              position: 'absolute', 
              width: '100%',
              maxWidth: '700px',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', 
              opacity: i === activeTestimonial ? 1 : 0, 
              transform: i === activeTestimonial ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)', 
              pointerEvents: i === activeTestimonial ? 'auto' : 'none' 
            }}>
              
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '3rem 2.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Decorative quote mark */}
                <div style={{ position: 'absolute', top: '-10px', left: '10px', fontSize: '10rem', color: 'rgba(255,255,255,0.02)', fontFamily: 'serif', lineHeight: 1, userSelect: 'none' }}>"</div>
                
                {/* Accent line */}
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0,191,165,0.5), transparent)' }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1,2,3,4,5].map(star => <span key={star} style={{ color: '#fbbf24', fontSize: '1.2rem' }}>★</span>)}
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '1.25rem', color: '#fff', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '2.5rem', fontWeight: 300 }}>"{t.text}"</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#00bfa5,#0097a7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px solid rgba(0,191,165,0.3)', boxShadow: '0 4px 12px rgba(0,191,165,0.2)' }}>{t.avatar}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', marginBottom: '0.2rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#00bfa5', fontWeight: 500 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 32 : 10, height: 10, borderRadius: '999px', background: i === activeTestimonial ? '#a78bfa' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', padding: 0 }} />
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, overflow: 'hidden', padding: '8rem 5% 7rem', textAlign: 'center' }}>
        {/* Layered glow backgrounds */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,9,18,0) 0%, rgba(0,191,165,0.06) 40%, rgba(59,130,246,0.05) 70%, rgba(6,9,18,0) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,191,165,0.1) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,191,165,0.4), rgba(59,130,246,0.4), transparent)' }} />

        {/* Floating orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '8%', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,191,165,0.15), transparent)', filter: 'blur(30px)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: '90px', height: '90px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent)', filter: 'blur(25px)', animation: 'float 6s ease-in-out infinite reverse' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'linear-gradient(135deg, rgba(0,191,165,0.12), rgba(0,229,204,0.08))', border: '1px solid rgba(0,191,165,0.3)', borderRadius: '999px', padding: '0.45rem 1.25rem', fontSize: '0.78rem', color: '#00e5cc', fontWeight: 700, marginBottom: '2.5rem', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,191,165,0.15)' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#00e5cc', boxShadow: '0 0 10px #00e5cc', animation: 'pulse-ring 2s ease-out infinite' }} />
            🚀 Trusted by 500+ Clinics Across India
          </div>

          {/* Headline */}
          <h2 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: '1.5rem' }}>
            <span style={{ background: 'linear-gradient(135deg, #ffffff, rgba(255,255,255,0.8))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ready to transform</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #00bfa5 0%, #00e5cc 50%, #0097a7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shimmer 3s linear infinite', display: 'inline-block' }}>
              your clinic today?
            </span>
          </h2>

          {/* Subtext */}
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 1rem' }}>
            Stop chasing missed appointments. Start delivering smarter patient care — automated, prioritized, and beautifully organized.
          </p>

          {/* Mini stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', margin: '2.5rem 0', flexWrap: 'wrap' }}>
            {[
              { val: '1,240+', label: 'Appointments managed', color: '#3b82f6' },
              { val: '98%', label: 'Fewer missed follow-ups', color: '#00bfa5' },
              { val: '50+', label: 'Doctors supported', color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: s.color, letterSpacing: '-1px', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', marginTop: '0.3rem', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link to="/register" className="glow-btn" style={{ padding: '1.1rem 2.75rem', borderRadius: '16px', background: 'linear-gradient(135deg, #00bfa5, #0097a7)', color: '#fff', fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none', boxShadow: '0 12px 40px rgba(0,191,165,0.5)', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.25s ease' }}>
              🚀 Start Free — No Card Needed
            </Link>
            <Link to="/login" style={{ padding: '1.1rem 2.75rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '1.05rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', transition: 'all 0.25s ease' }}>
              Sign In to Dashboard →
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {['🔒 HTTPS Secured', '✅ No credit card', '⚡ 2-min setup', '🆓 Free forever plan'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{b}</div>
            ))}
          </div>

          {/* Social proof avatars */}
          <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex' }}>
              {['👩‍⚕️', '👨‍⚕️', '👩‍💼', '🧑‍⚕️', '👩‍💻'].map((av, i) => (
                <div key={i} style={{ width: 38, height: 38, borderRadius: '50%', background: `hsl(${i * 60 + 170}, 60%, 30%)`, border: '2px solid rgba(0,191,165,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginLeft: i > 0 ? '-10px' : 0, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>{av}</div>
              ))}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Join 500+ healthcare professionals</div>
              <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#fbbf24', fontSize: '0.8rem' }}>★</span>)}
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', marginLeft: '4px' }}>4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', zIndex: 1, background: 'rgba(4,7,15,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Top footer */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 5% 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#00bfa5,#0097a7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(0,191,165,0.3)' }}>🏥</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Practo Tracker</div>
                <div style={{ fontSize: '0.6rem', color: '#00bfa5', fontWeight: 500 }}>Clinic Analyzer</div>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: '220px' }}>
              Smart clinic management — appointments, follow-ups, complaints and analytics all in one place.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
              {['🔗', '🐦', '📧'].map((icon, i) => (
                <div key={i} style={{ width: 34, height: 34, borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', cursor: 'pointer' }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '1.25rem', textTransform: 'uppercase' }}>Product</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Appointments', to: '/book-appointment' },
                { label: 'Follow-up Tracker', to: '/follow-ups' },
                { label: 'Analytics', to: '/analytics' },
                { label: 'Doctor Directory', to: '/doctors' },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#00bfa5'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Support links */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '1.25rem', textTransform: 'uppercase' }}>Support</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { label: 'Contact Us', to: '/contact' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Complaints', to: '/complaints' },
                { label: 'Service Tickets', to: '/tickets' },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#00bfa5'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter / CTA mini */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '1.25rem', textTransform: 'uppercase' }}>Stay Updated</div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginBottom: '1rem' }}>Get product updates and clinic tips delivered to you.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <input
                placeholder="your@clinic.com"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: '#fff', outline: 'none', fontFamily: 'inherit' }}
              />
              <button style={{ background: 'linear-gradient(135deg, #00bfa5, #0097a7)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.65rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(0,191,165,0.3)' }}>
                Subscribe →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom footer bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.22)' }}>
            © 2026 Practo Tracker. Built with ❤️ for healthcare teams across India.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { label: 'Privacy', to: '/privacy' },
              { label: 'Terms', to: '/terms' },
              { label: 'Contact', to: '/contact' },
            ].map(l => (
              <Link key={l.label} to={l.to} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#00bfa5'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.28)'}
              >{l.label}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#00bfa5', boxShadow: '0 0 6px #00bfa5' }} />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}
