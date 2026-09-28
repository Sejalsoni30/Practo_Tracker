import { supabase } from '../config/db.js';

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const { data: doctors, error } = await supabase.from('doctors').select('*');
    if (error) throw error;
    res.status(200).json((doctors || []).map(d => ({ ...d, _id: d.id })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a doctor
export const addDoctor = async (req, res) => {
  try {
    const { name, specialty, experience, timing } = req.body;

    const { data: savedDoctor, error } = await supabase.from('doctors').insert([{
      name,
      specialty,
      experience,
      timing
    }]).select().single();

    if (error) throw error;

    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};