import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    consultationType: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
