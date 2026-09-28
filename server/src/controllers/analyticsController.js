import { supabase } from '../config/db.js';

export const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Total appointments
    const { count: totalAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true });

    // Missed appointments (date < today AND status = Scheduled)
    const { data: scheduledAppts } = await supabase.from('appointments').select('*, doctors(name, specialty)').eq('status', 'Scheduled');
    const missedAppointmentsRaw = (scheduledAppts || []).filter(a => new Date(a.date) < today);
    const missedAppointments = missedAppointmentsRaw.map(app => ({
      ...app,
      doctorId: { _id: app.doctor_id, name: app.doctors?.name, specialty: app.doctors?.specialty },
      _id: app.id
    }));

    // Upcoming today
    const { data: todayApptsRaw } = await supabase.from('appointments').select('*, doctors(name, specialty)').eq('date', todayStr);
    const todayAppointments = (todayApptsRaw || []).map(app => ({
      ...app,
      doctorId: { _id: app.doctor_id, name: app.doctors?.name, specialty: app.doctors?.specialty },
      _id: app.id
    }));

    // Patients needing urgent follow-up
    const { data: urgentRaw } = await supabase.from('appointments').select('*, doctors(name)').eq('status', 'Pending Follow-up');
    const urgentFollowUps = (urgentRaw || []).map(app => ({
      ...app,
      doctorId: { _id: app.doctor_id, name: app.doctors?.name },
      _id: app.id
    }));

    // Counts
    const { count: completedAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'Completed');
    const { count: cancelledAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'Cancelled');
    const { count: scheduled } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'Scheduled');

    // Complaints stats
    const { count: totalComplaints } = await supabase.from('complaints').select('*', { count: 'exact', head: true });
    const { count: openComplaints } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).in('status', ['Open', 'In Progress']);
    const { count: highPriorityComplaints } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('priority', 'High').neq('status', 'Resolved');

    // Ticket stats
    const { count: totalTickets } = await supabase.from('tickets').select('*', { count: 'exact', head: true });
    const { count: openTickets } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).in('status', ['Open', 'In Progress', 'Pending']);

    // Doctors
    const { data: doctors } = await supabase.from('doctors').select('*');

    res.status(200).json({
      totalAppointments: totalAppointments || 0,
      missedCount: missedAppointments.length,
      missedAppointments: missedAppointments.slice(0, 10),
      todayAppointments,
      urgentFollowUps,
      completedAppointments: completedAppointments || 0,
      cancelledAppointments: cancelledAppointments || 0,
      scheduledAppointments: scheduled || 0,
      totalComplaints: totalComplaints || 0,
      openComplaints: openComplaints || 0,
      highPriorityComplaints: highPriorityComplaints || 0,
      totalTickets: totalTickets || 0,
      openTickets: openTickets || 0,
      totalDoctors: (doctors || []).length,
      doctors: (doctors || []).map(d => ({ ...d, _id: d.id })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Global search
export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query required' });

    // Appointments search
    const { data: apptsRaw } = await supabase.from('appointments')
      .select('*, doctors(name, specialty)')
      .ilike('patient_name', `%${q}%`)
      .limit(10);
      
    const appointments = (apptsRaw || []).map(app => ({
      ...app,
      doctorId: { _id: app.doctor_id, name: app.doctors?.name, specialty: app.doctors?.specialty },
      _id: app.id
    }));

    // Doctors search
    const { data: docsRaw } = await supabase.from('doctors')
      .select('*')
      .or(`name.ilike.%${q}%,specialty.ilike.%${q}%`)
      .limit(10);
      
    const doctors = (docsRaw || []).map(d => ({ ...d, _id: d.id }));

    // Complaints search
    const { data: compRaw } = await supabase.from('complaints')
      .select('*')
      .ilike('patient_name', `%${q}%`)
      .limit(10);
      
    const complaints = (compRaw || []).map(c => ({ ...c, _id: c.id }));

    res.status(200).json({ appointments, doctors, complaints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
