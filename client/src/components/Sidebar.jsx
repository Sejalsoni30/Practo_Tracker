import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={sidebarStyle}>
      <div style={brandStyle}>Practo Menu</div>
      <ul style={listStyle}>
        <li>
          <Link to="/dashboard" style={{ ...menuItemStyle, background: isActive('/dashboard') ? '#edf2f7' : 'transparent' }}>
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/book-appointment" style={{ ...menuItemStyle, background: isActive('/book-appointment') ? '#edf2f7' : 'transparent' }}>
            📅 Appointments
          </Link>
        </li>
        <li>
          <Link to="/follow-ups" style={{ ...menuItemStyle, background: isActive('/follow-ups') ? '#edf2f7' : 'transparent' }}>
            🩺 Follow-up Tracker
          </Link>
        </li>
      </ul>
    </aside>
  );
}

const sidebarStyle = {
  width: '240px',
  height: '100vh',
  backgroundColor: '#ffffff',
  boxShadow: '2px 0 4px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0,
  left: 0,
};

const brandStyle = {
  padding: '1.5rem',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#2d3748',
  borderBottom: '1px solid #e2e8f0',
};

const listStyle = {
  listStyle: 'none',
  padding: '1rem 0',
};

const menuItemStyle = {
  display: 'block',
  padding: '0.75rem 1.5rem',
  color: '#4a5568',
  fontWeight: '500',
  borderRadius: '4px',
  margin: '0.25rem 0.75rem',
};