import { supabase } from '../config/db.js';

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctors (
          name,
          specialty
        )
      `);
      
    if (error) throw error;
    
    // Map to match Mongoose populate structure for frontend compatibility
    const formatted = appointments.map(app => ({
      ...app,
      doctorId: { _id: app.doctor_id, name: app.doctors?.name, specialty: app.doctors?.specialty },
      _id: app.id
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, date, timeSlot, symptoms } = req.body;
    
    const { data: savedAppointment, error } = await supabase.from('appointments').insert([{
      doctor_id: doctorId,
      patient_name: patientName,
      date,
      time_slot: timeSlot,
      symptoms,
      status: 'Scheduled'
    }]).select().single();

    if (error) throw error;

    res.status(201).json({ ...savedAppointment, _id: savedAppointment.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: updated, error } = await supabase.from('appointments').update({ status }).eq('id', id).select().single();

    if (error || !updated) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ ...updated, _id: updated.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};