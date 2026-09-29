import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AppointmentBooking from './pages/AppointmentBooking';
import FollowUpTracker from './pages/FollowUpTracker';
import Analytics from './pages/Analytics';
import MissedAppointments from './pages/MissedAppointments';
import Complaints from './pages/Complaints';
import Tickets from './pages/Tickets';
import Search from './pages/Search';
import Reports from './pages/Reports';
import DoctorDirectory from './pages/DoctorDirectory';
import PatientRecords from './pages/PatientRecords';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import './styles/index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-appointment" element={<AppointmentBooking />} />
          <Route path="/follow-ups" element={<FollowUpTracker />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/missed-appointments" element={<MissedAppointments />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/doctors" element={<DoctorDirectory />} />
          <Route path="/patients" element={<PatientRecords />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;