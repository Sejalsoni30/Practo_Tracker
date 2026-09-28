import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-name">🏥 Practo Tracker</div>
          <div className="brand-sub">Clinic Appointment Analyzer</div>
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
          <div className="topbar-title">{title}</div>
          <div className="topbar-right">
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
