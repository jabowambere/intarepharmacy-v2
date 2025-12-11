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
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.default.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
          user: 'your-email@domain.com',
          pass: process.env.BREVO_API_KEY
        }
      });
      
      const info = await transporter.sendMail({
        from: `"Intare Pharmacy" <${process.env.FROM_EMAIL}>`,
        to: customerEmail,
        subject: 'Order Received - Intare Pharmacy',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #228B22;">Intare Pharmacy</h2>
            <p>Dear ${customerName},</p>
            <p>Thank you for your order! We have received your prescription and it is now being reviewed by our pharmacist.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Order Details:</strong><br>
              Order ID: #${purchase._id}<br>
              Medicine: ${purchase.medicineName}<br>
              Quantity: ${quantity}<br>
              Total: $${purchase.totalPrice}<br>
              Status: Pending Review
            </div>
            <p>You will receive another email once your prescription has been reviewed.</p>
            <p>Best regards,<br>Intare Pharmacy Team</p>
          </div>
        `
      });
      
      console.log('✅ Order confirmation email sent to:', customerEmail);
      console.log('📧 Message ID:', info.messageId);
    } catch (emailError) {
      console.log('❌ Order confirmation email failed:', emailError.message);
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
          user: 'your-email@domain.com',
          pass: process.env.BREVO_API_KEY
        }
      });
      
      const statusMessages = {
        confirmed: 'Your order has been confirmed and will be delivered soon.',
        delivered: 'Your order has been successfully delivered. Thank you!',
        failed: 'Unfortunately, your order could not be processed. Please contact us.'
      };
      
      const info = await transporter.sendMail({
        from: `"Intare Pharmacy" <${process.env.FROM_EMAIL}>`,
        to: purchase.customerEmail,
        subject: `Order ${status.charAt(0).toUpperCase() + status.slice(1)} - Intare Pharmacy`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #228B22;">Intare Pharmacy</h2>
            <p>Dear ${purchase.customerName},</p>
            <p>${statusMessages[status]}</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Order Details:</strong><br>
              Order ID: #${purchase._id}<br>
              Medicine: ${purchase.medicineName}<br>
              Quantity: ${purchase.quantity}<br>
              Status: ${status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            <p>Best regards,<br>Intare Pharmacy Team</p>
          </div>
        `
      });
      
      console.log('✅ Email sent successfully to:', purchase.customerEmail);
      console.log('📧 Message ID:', info.messageId);
    } catch (emailError) {
      console.log('❌ Email sending failed:', emailError.message);
      // Fallback: Log email to console
      console.log('\n=== EMAIL NOTIFICATION (FALLBACK) ===');
      console.log(`To: ${purchase.customerEmail}`);
      console.log(`Subject: Order ${status.charAt(0).toUpperCase() + status.slice(1)} - Intare Pharmacy`);
      console.log(`Customer: ${purchase.customerName}`);
      console.log(`Medicine: ${purchase.medicineName}`);
      console.log(`Status: ${status}`);
      console.log('=====================================\n');
    }
    
    res.json({ message: "Status updated successfully", purchase });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};