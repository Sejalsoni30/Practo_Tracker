import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const demoDoctors = [
  { name: 'Dr. Ayesha Khan',      specialty: 'Cardiologist',       experience: 12, timing: 'Mon-Fri: 9:00 AM - 1:00 PM' },
  { name: 'Dr. Rahul Sharma',     specialty: 'Dermatologist',      experience: 8,  timing: 'Mon-Sat: 10:00 AM - 2:00 PM' },
  { name: 'Dr. Priya Mehta',      specialty: 'Neurologist',        experience: 15, timing: 'Tue-Sat: 11:00 AM - 3:00 PM' },
  { name: 'Dr. Anil Verma',       specialty: 'Orthopedic Surgeon', experience: 20, timing: 'Mon-Fri: 8:00 AM - 12:00 PM' },
  { name: 'Dr. Sneha Patel',      specialty: 'Pediatrician',       experience: 10, timing: 'Mon-Sat: 9:00 AM - 5:00 PM' },
  { name: 'Dr. Vikram Singh',     specialty: 'General Physician',  experience: 6,  timing: 'Mon-Sun: 8:00 AM - 8:00 PM' },
  { name: 'Dr. Meera Joshi',      specialty: 'Gynecologist',       experience: 14, timing: 'Mon-Fri: 10:00 AM - 4:00 PM' },
  { name: 'Dr. Suresh Nair',      specialty: 'Ophthalmologist',    experience: 9,  timing: 'Tue-Sun: 9:00 AM - 1:00 PM' },
  { name: 'Dr. Kavita Reddy',     specialty: 'Dentist',            experience: 7,  timing: 'Mon-Sat: 11:00 AM - 6:00 PM' },
  { name: 'Dr. Arjun Malhotra',   specialty: 'ENT Specialist',     experience: 11, timing: 'Mon-Fri: 9:00 AM - 3:00 PM' },
];

async function seedDoctors() {
  try {
    console.log('Connecting to Supabase...');

    const { count } = await supabase.from('doctors').select('*', { count: 'exact', head: true });
    
    if (count > 0) {
      console.log(`${count} doctors already exist. Clearing and re-seeding...`);
      // Since delete without filter is not allowed, we use a dummy condition
      await supabase.from('doctors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }

    const { error } = await supabase.from('doctors').insert(demoDoctors);
    if (error) throw error;

    console.log(`✅ Successfully seeded ${demoDoctors.length} demo doctors!`);

    demoDoctors.forEach(d => console.log(`  - ${d.name} (${d.specialty})`));
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  }
}

seedDoctors();
