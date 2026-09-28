import { supabase } from '../config/db.js';

// Function to check and flag appointments needing follow-up
export const checkFollowUpReminders = async () => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Find scheduled appointments that fall on or before today and flag them for follow-up
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'Pending Follow-up' })
      .lte('date', currentDate)
      .eq('status', 'Scheduled')
      .select();

    if (error) throw error;

    console.log(`Reminder Scheduler: Updated ${(data || []).length} appointments to follow-up status.`);
  } catch (error) {
    console.error('Error running reminder scheduler:', error);
  }
};