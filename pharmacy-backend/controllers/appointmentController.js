import Appointment from "../models/Appointment.js";

// CREATE appointment
export const createAppointment = async (req, res) => {
  try {
    console.log('📅 Creating appointment with data:', req.body);
    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();
    console.log('✅ Appointment saved:', savedAppointment);

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error('❌ Error creating appointment:', error);
    res.status(500).json({
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// GET all appointments
export const getAppointments = async (req, res) => {
  try {
    console.log('📅 Getting appointments from database...');
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    console.log('📅 Found appointments:', appointments.length);
    console.log('📅 Appointments data:', appointments);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// UPDATE appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment status updated successfully', appointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
