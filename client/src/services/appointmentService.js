import API from './api';

export const appointmentService = {
  // Fetch all appointments
  getAllAppointments: async () => {
    const response = await API.get('/appointments');
    return response.data;
  },

  // Book a new appointment
  createAppointment: async (appointmentData) => {
    const response = await API.post('/appointments', appointmentData);
    return response.data;
  },

  // Fetch pending patient follow-ups
  getFollowUps: async () => {
    const response = await API.get('/follow-ups');
    return response.data;
  },

  // Update appointment status (e.g., Completed, Cancelled)
  updateStatus: async (id, status) => {
    const response = await API.patch(`/appointments/${id}/status`, { status });
    return response.data;
  }
};