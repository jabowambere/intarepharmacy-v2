import Purchase from "../models/Purchase.js";

export const createPurchase = async (req, res) => {
  try {
    const { medicineId, customerName, customerEmail, customerPhone, customerAddress, quantity, prescription } = req.body;
    
    const purchase = new Purchase({
      medicineName: req.body.medicineName || 'Medicine',
      medicineId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      quantity,
      totalPrice: req.body.totalPrice || 0,
      prescription: prescription || ''
    });
    
    await purchase.save();
    
    // Send order confirmation email
    try {
      console.log('🔧 Attempting to send email...');
      console.log('📧 To:', customerEmail);
      console.log('🔑 BREVO_LOGIN_EMAIL:', process.env.BREVO_LOGIN_EMAIL || 'NOT SET');
      console.log('🔑 BREVO_SMTP_PASSWORD:', process.env.BREVO_SMTP_PASSWORD ? 'SET' : 'NOT SET');
      console.log('📤 FROM_EMAIL:', process.env.FROM_EMAIL || 'NOT SET');
      
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.default.createTransporter({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_LOGIN_EMAIL,
          pass: process.env.BREVO_SMTP_PASSWORD
        },
        debug: true,
        logger: true
      });
      
      console.log('📨 Sending email...');
      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: customerEmail,
        subject: 'Order Confirmation - Intare Pharmacy',
        text: `Dear ${customerName}, Your order for ${purchase.medicineName} has been received. Quantity: ${quantity}, Total: $${purchase.totalPrice}. Thank you!`,
        html: `
          <h2>Order Confirmed!</h2>
          <p>Dear ${customerName},</p>
          <p>Your order for ${purchase.medicineName} has been received.</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            <li>Medicine: ${purchase.medicineName}</li>
            <li>Quantity: ${quantity}</li>
            <li>Total: $${purchase.totalPrice}</li>
          </ul>
          <p>Thank you for choosing Intare Pharmacy!</p>
        `
      });
      
      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', info.messageId);
    } catch (emailError) {
      console.log('❌ Email error occurred:');
      console.log('Error code:', emailError.code);
      console.log('Error message:', emailError.message);
      console.log('Error response:', emailError.response);
      console.log('Full error:', JSON.stringify(emailError, null, 2));
    }
    
    res.status(201).json({ message: "Purchase successful", purchase });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const purchase = await Purchase.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    
    // Send email notification
    try {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.default.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_LOGIN_EMAIL,
          pass: process.env.BREVO_SMTP_PASSWORD
        }
      });
      
      const statusMessages = {
        confirmed: 'Your order has been confirmed and will be delivered soon.',
        delivered: 'Your order has been successfully delivered. Thank you!',
        failed: 'Unfortunately, your order could not be processed. Please contact us.'
      };
      
      await transporter.sendMail({
        from: `"Intare Pharmacy" <${process.env.FROM_EMAIL}>`,
        to: purchase.customerEmail,
        subject: `Order ${status.charAt(0).toUpperCase() + status.slice(1)} - Intare Pharmacy`,
        html: `
          <h2>Order ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
          <p>Dear ${purchase.customerName},</p>
          <p>${statusMessages[status]}</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            <li>Order ID: #${purchase._id.toString().slice(-8).toUpperCase()}</li>
            <li>Medicine: ${purchase.medicineName}</li>
            <li>Status: ${status.toUpperCase()}</li>
          </ul>
          <p>Best regards,<br>Intare Pharmacy Team</p>
        `
      });
      
      console.log('✅ Status update email sent to:', purchase.customerEmail);
    } catch (emailError) {
      console.log('❌ Email sending failed:', emailError.message);
    }
    
    res.json({ message: "Status updated successfully", purchase });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};