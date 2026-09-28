import { supabase } from '../config/db.js';

// Create a new contact message
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const { data: savedMessage, error } = await supabase.from('contact_messages').insert([{
      name,
      email,
      subject,
      message,
      status: 'Unread'
    }]).select().single();

    if (error) throw error;

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
