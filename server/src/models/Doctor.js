import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    required: true
  },
  timing: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Doctor', doctorSchema);