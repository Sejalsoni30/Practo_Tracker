import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true },
  patientName: { type: String, required: true, trim: true },
  issueType: {
    type: String,
    enum: ['Appointment Rescheduling', 'Prescription Refill', 'Lab Report', 'Insurance Query', 'Referral', 'Other'],
    default: 'Other'
  },
  description: { type: String, required: true },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low', 'No Issue'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: { type: String, default: 'Unassigned' },
  dueDate: { type: Date },
  resolvedAt: { type: Date },
  nextAction: { type: String, default: '' }
}, { timestamps: true });

// Auto-generate ticket number before save
ticketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketNumber = `TKT-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Ticket', ticketSchema);
