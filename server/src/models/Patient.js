import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  lastDiagnosis: {
    type: String,
    default: 'General Checkup'
  }
}, {
  timestamps: true
});

export default mongoose.model('Patient', patientSchema);