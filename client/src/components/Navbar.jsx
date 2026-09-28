import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={navStyle}>
      <h2 style={logoStyle}>Practo Tracker</h2>
      <div style={linkContainerStyle}>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/book-appointment" style={linkStyle}>Book Appointment</Link>
        <Link to="/follow-ups" style={linkStyle}>Follow-ups</Link>
        {token ? (
          <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
        ) : (
          <Link to="/" style={linkStyle}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const logoStyle = {
  color: '#00bfa5',
  fontSize: '1.25rem',
};

const linkContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
};

const linkStyle = {
  color: '#4a5568',
  fontWeight: '500',
};

const logoutBtnStyle = {
  backgroundColor: '#e53e3e',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
};