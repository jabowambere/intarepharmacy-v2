import React, { useState } from 'react';
import './Appointment.css';
import appImg from './appointment.png';

const Appointment = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
    consultationType: '',
    symptoms: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const consultationTypes = [
    'General Consultation',
    'Medication Review',
    'Health Screening',
    'Vaccination'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Appointment booked successfully! We will contact you soon.');
        setFormData({
          patientName: '',
          email: '',
          phone: '',
          appointmentDate: '',
          appointmentTime: '',
          consultationType: '',
          symptoms: ''
        });
      } else {
        setMessage(data.message || 'Error booking appointment');
      }
    } catch (error) {
      setMessage('Error booking appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="appointment-container">
      <div className="appointment-content">
        <div className="appointment-avatar-container">
          <img src={appImg} alt="Healthcare Professional" className="appointment-avatar-img" />
        </div>
        
        <div className="appointment-right">
          <div className="appointment-header">
            <h1>Book an Appointment</h1>
            <p>Schedule a consultation with our experienced pharmacists</p>
          </div>

          <div className="appointment-form-container">
            <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="patientName">Full Name *</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointmentDate">Preferred Date *</label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={today}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="appointmentTime">Preferred Time *</label>
              <select
                id="appointmentTime"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="consultationType">Consultation Type *</label>
            <select
              id="consultationType"
              name="consultationType"
              value={formData.consultationType}
              onChange={handleChange}
              required
            >
              <option value="">Select Consultation Type</option>
              {consultationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="symptoms">Symptoms or Concerns</label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="4"
              placeholder="Please describe your symptoms or health concerns..."
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div style={{width: '16px', height: '16px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                Booking...
              </span>
            ) : 'Book Appointment'}
          </button>

          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;