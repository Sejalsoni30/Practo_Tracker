import { supabase } from '../config/db.js';

// Get all tickets
export const getTickets = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = supabase.from('tickets').select('*').order('created_at', { ascending: false });
    
    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (search) query = query.ilike('patient_name', `%${search}%`);
    
    const { data: tickets, error } = await query;
    if (error) throw error;
    
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create ticket
export const createTicket = async (req, res) => {
  try {
    const { patientName, issueType, description, priority, dueDate } = req.body;
    let nextAction = '';
    if (priority === 'High') nextAction = 'Immediate action required — escalate to department head';
    else if (priority === 'Medium') nextAction = 'Assign to responsible team, resolve within 3 days';
    else nextAction = 'Schedule for next available resolution slot';

    const { count, error: countErr } = await supabase.from('tickets').select('*', { count: 'exact', head: true });
    if (countErr) throw countErr;
    const ticketNumber = `TKT-${String((count || 0) + 1).padStart(4, '0')}`;

    const { data: saved, error } = await supabase.from('tickets').insert([{
      ticket_number: ticketNumber,
      patient_name: patientName,
      issue_type: issueType,
      description,
      priority,
      due_date: dueDate || null,
      next_action: nextAction
    }]).select().single();
    
    if (error) throw error;

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update ticket
export const updateTicket = async (req, res) => {
  try {
    const { status, assignedTo, nextAction } = req.body;
    const update = {};
    if (status !== undefined) update.status = status;
    if (assignedTo !== undefined) update.assigned_to = assignedTo;
    if (nextAction !== undefined) update.next_action = nextAction;
    if (status === 'Resolved' || status === 'Closed') update.resolved_at = new Date();
    
    const { data: updated, error } = await supabase.from('tickets').update(update).eq('id', req.params.id).select().single();
    if (error) throw error;
    
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const { error } = await supabase.from('tickets').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
