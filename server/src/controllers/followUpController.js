import { supabase } from '../config/db.js';

// Get all follow-ups
export const getFollowUps = async (req, res) => {
  try {
    const { data: followUps, error } = await supabase
      .from('follow_ups')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    const formatted = followUps.map(f => ({
      _id: f.id,
      patientName: f.patient_name,
      dueDate: f.due_date,
      notes: f.notes
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new follow-up
export const createFollowUp = async (req, res) => {
  try {
    const { patientName, dueDate, notes } = req.body;
    
    const { data: saved, error } = await supabase.from('follow_ups').insert([{
      patient_name: patientName,
      due_date: dueDate || null,
      notes
    }]).select().single();

    if (error) throw error;

    res.status(201).json({
      _id: saved.id,
      patientName: saved.patient_name,
      dueDate: saved.due_date,
      notes: saved.notes
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};