import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  patientName: { type: String, required: true, trim: true },
  patientContact: { type: String, trim: true },
  category: {
    type: String,
    enum: ['Service Quality', 'Doctor Behavior', 'Billing Issue', 'Wait Time', 'Facility Issue', 'Other'],
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
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: { type: String, default: 'Unassigned' },
  resolvedAt: { type: Date },
  nextAction: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);
