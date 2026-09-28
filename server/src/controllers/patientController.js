import { supabase } from '../config/db.js';

// Get all patients
export const getPatients = async (req, res) => {
  try {
    const { data: patients, error } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json((patients || []).map(p => ({ ...p, _id: p.id })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a patient
export const createPatient = async (req, res) => {
  try {
    const { name, contact, age, gender, lastDiagnosis } = req.body;
    
    const { data: savedPatient, error } = await supabase.from('patients').insert([{
      name,
      contact,
      age,
      gender,
      last_diagnosis: lastDiagnosis
    }]).select().single();

    if (error) throw error;
    res.status(201).json({ ...savedPatient, _id: savedPatient.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single patient
export const getPatient = async (req, res) => {
  try {
    const { data: patient, error } = await supabase.from('patients').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.status(200).json({ ...patient, _id: patient.id });
  } catch (error) {
    res.status(404).json({ message: 'Patient not found' });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const { name, contact, age, gender, lastDiagnosis } = req.body;
    const { data: updated, error } = await supabase.from('patients').update({
      name,
      contact,
      age,
      gender,
      last_diagnosis: lastDiagnosis
    }).eq('id', req.params.id).select().single();

    if (error) throw error;
    res.status(200).json({ ...updated, _id: updated.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
