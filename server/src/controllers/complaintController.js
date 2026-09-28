import { supabase } from '../config/db.js';

// Get all complaints
export const getComplaints = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = supabase.from('complaints').select('*').order('created_at', { ascending: false });
    
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (search) query = query.ilike('patient_name', `%${search}%`);
    
    const { data: complaints, error } = await query;
    if (error) throw error;
    
    // Map _id for frontend compatibility
    res.status(200).json(complaints.map(c => ({...c, _id: c.id})));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create complaint
export const createComplaint = async (req, res) => {
  try {
    const { patientName, patientContact, category, description, priority } = req.body;
    let nextAction = '';
    if (priority === 'High') nextAction = 'Contact patient within 24 hours and escalate to senior staff';
    else if (priority === 'Medium') nextAction = 'Review and respond within 48 hours';
    else nextAction = 'Log and review in weekly complaint review meeting';

    const { data: saved, error } = await supabase.from('complaints').insert([{
      patient_name: patientName,
      patient_contact: patientContact,
      category,
      description,
      priority,
      next_action: nextAction
    }]).select().single();
    
    if (error) throw error;
    res.status(201).json({ ...saved, _id: saved.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update complaint status
export const updateComplaint = async (req, res) => {
  try {
    const { status, assignedTo, nextAction } = req.body;
    const update = {};
    if (status) update.status = status;
    if (assignedTo) update.assigned_to = assignedTo;
    if (nextAction) update.next_action = nextAction;
    if (status === 'Resolved' || status === 'Closed') update.resolved_at = new Date();
    
    const { data: updated, error } = await supabase.from('complaints').update(update).eq('id', req.params.id).select().single();
    if (error) throw error;
    
    res.status(200).json({ ...updated, _id: updated.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete complaint
export const deleteComplaint = async (req, res) => {
  try {
    const { error } = await supabase.from('complaints').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
