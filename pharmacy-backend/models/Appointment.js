import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  consultationType: {
    type: String,
    required: true,
    enum: ['General Consultation', 'Medication Review', 'Health Screening', 'Vaccination']
  },
  symptoms: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled']
  }
}, {
  timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);