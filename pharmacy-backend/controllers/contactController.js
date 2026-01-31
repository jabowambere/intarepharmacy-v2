import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Save to database
    const contact = new Contact({ name, email, message });
    await contact.save();
    
    // Send email notification
    try {
      const transporter = nodemailer.createTransporter({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_LOGIN_EMAIL,
          pass: process.env.BREVO_SMTP_PASSWORD
        }
      });
      
      // Send notification to admin
      await transporter.sendMail({
        from: `"Intare Pharmacy" <${process.env.FROM_EMAIL}>`,
        to: process.env.FROM_EMAIL, // Send to pharmacy email
        subject: 'New Contact Form Submission - Intare Pharmacy',
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
        `
      });
      
      // Send confirmation to user
      await transporter.sendMail({
        from: `"Intare Pharmacy" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: 'Thank you for contacting Intare Pharmacy',
        html: `
          <h2>Thank you for your message!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <p><em>"${message}"</em></p>
          <p>Best regards,<br>Intare Pharmacy Team</p>
        `
      });
      
      console.log('✅ Contact form emails sent successfully');
    } catch (emailError) {
      console.log('❌ Email sending failed:', emailError.message);
    }
    
    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};