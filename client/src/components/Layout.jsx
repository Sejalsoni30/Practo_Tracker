import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/index.css';

const navItems = [
  { section: 'Overview', items: [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/analytics', icon: '📈', label: 'Analytics' },
  ]},
  { section: 'Appointments', items: [
    { path: '/book-appointment', icon: '📅', label: 'Book Appointment' },
    { path: '/missed-appointments', icon: '⚠️', label: 'Missed Appointments' },
  ]},
  { section: 'Patients', items: [
    { path: '/follow-ups', icon: '🩺', label: 'Follow-up Tracker' },
    { path: '/patients', icon: '👥', label: 'Patient Records' },
    { path: '/search', icon: '🔍', label: 'Search' },
  ]},
  { section: 'Clinic Management', items: [
    { path: '/complaints', icon: '📋', label: 'Complaints' },
    { path: '/tickets', icon: '🎫', label: 'Service Tickets' },
    { path: '/doctors', icon: '👨‍⚕️', label: 'Doctor Directory' },
  ]},
  { section: 'Reports', items: [
    { path: '/reports', icon: '📄', label: 'Reports & Export' },
  ]},
];

export default function Layout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when route changes (mobile nav)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div>
            <div className="brand-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/favicon.png" alt="Practo Tracker Logo" style={{ width: 28, height: 28, borderRadius: '7px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,191,165,0.35)' }} />
              Practo Tracker
            </div>
            <div className="brand-sub">Clinic Appointment Analyzer</div>
          </div>
          {/* Close button (mobile only) */}
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section}>
              <div className="sidebar-section">{section.section}</div>
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
            Logged in as <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{user?.name || 'Staff'}</strong>
          </div>
          <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          {/* Hamburger (mobile only) */}
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            id="hamburger-menu-btn"
          >
            <span />
            <span />
            <span />
          </button>

          <div className="topbar-title">{title}</div>

          <div className="topbar-right">
            <span className="date-text" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              id="theme-toggle-btn"
            >
              <span className="toggle-icon" style={{ transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </button>
          </div>
        </header>
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}

