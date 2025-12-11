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
          user: process.env.BREVO_LOGIN_EMAIL,
          pass: process.env.BREVO_SMTP_PASSWORD
        }
      });
      
      const info = await transporter.sendMail({
        from: `"Intare Pharmacy" <${process.env.FROM_EMAIL}>`,
        to: customerEmail,
        subject: 'Order Received - Intare Pharmacy',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation - Intare Pharmacy</title>
          </head>
          <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #228B22 0%, #32CD32 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏥 Intare Pharmacy</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Your Trusted Healthcare Partner</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #228B22, #32CD32); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px;">✅</div>
                  <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Order Received Successfully!</h2>
                  <p style="color: #666; margin: 0; font-size: 16px;">Thank you for choosing Intare Pharmacy</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #228B22;">
                  <h3 style="color: #228B22; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 Order Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #666; font-weight: 500;">Order ID:</td><td style="padding: 8px 0; color: #333; font-weight: 600;">#${purchase._id.toString().slice(-8).toUpperCase()}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666; font-weight: 500;">Medicine:</td><td style="padding: 8px 0; color: #333; font-weight: 600;">${purchase.medicineName}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666; font-weight: 500;">Quantity:</td><td style="padding: 8px 0; color: #333; font-weight: 600;">${quantity} units</td></tr>
                    <tr><td style="padding: 8px 0; color: #666; font-weight: 500;">Total Amount:</td><td style="padding: 8px 0; color: #228B22; font-weight: 700; font-size: 18px;">$${purchase.totalPrice}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666; font-weight: 500;">Status:</td><td style="padding: 8px 0;"><span style="background: #fff3cd; color: #856404; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">📋 PENDING REVIEW</span></td></tr>
                  </table>
                </div>
                
                <div style="background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%); border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #2196F3;">
                  <h4 style="color: #1976D2; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">📞 What's Next?</h4>
                  <p style="color: #666; margin: 0; line-height: 1.6;">Our licensed pharmacist is now reviewing your prescription. You'll receive another email once the review is complete with further instructions.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <p style="color: #666; margin: 0 0 20px 0; line-height: 1.6;">Thank you for trusting Intare Pharmacy with your healthcare needs.</p>
                  <div style="border-top: 2px solid #f0f0f0; padding-top: 20px;">
                    <p style="color: #333; margin: 0; font-weight: 600;">Best regards,</p>
                    <p style="color: #228B22; margin: 5px 0 0 0; font-weight: 700; font-size: 16px;">The Intare Pharmacy Team</p>
                  </div>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">📧 This email was sent to ${customerEmail}</p>
                <p style="color: #999; margin: 0; font-size: 12px;">© 2024 Intare Pharmacy. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
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
          user: process.env.BREVO_LOGIN_EMAIL,
          pass: process.env.BREVO_SMTP_PASSWORD
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
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Update - Intare Pharmacy</title>
          </head>
          <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #228B22 0%, #32CD32 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏥 Intare Pharmacy</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Order Status Update</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="width: 80px; height: 80px; background: ${status === 'confirmed' ? 'linear-gradient(135deg, #4CAF50, #8BC34A)' : status === 'delivered' ? 'linear-gradient(135deg, #2196F3, #03DAC6)' : 'linear-gradient(135deg, #FF5722, #FF9800)'}; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px;">${status === 'confirmed' ? '✅' : status === 'delivered' ? '🚚' : '❌'}</div>
                  <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Order ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
                  <p style="color: #666; margin: 0; font-size: 16px;">Dear ${purchase.customerName},</p>
                </div>
                
                <div style="background: ${status === 'confirmed' ? 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)' : status === 'delivered' ? 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)' : 'linear-gradient(135deg, #ffebee 0%, #ffffff 100)'}; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid ${status === 'confirmed' ? '#4CAF50' : status === 'delivered' ? '#2196F3' : '#FF5722'};">
                  <h3 style="color: ${status === 'confirmed' ? '#2E7D32' : status === 'delivered' ? '#1976D2' : '#D32F2F'}; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📝 Status Update</h3>
                  <p style="color: #666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">${statusMessages[status]}</p>
                  
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; color: #666; font-weight: 500;">Order ID:</td><td style="padding: 8px 0; color: #333; font-weight: 600;">#${purchase._id.toString().slice(-8).toUpperCase()}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666; font-weight: 500;">Medicine:</td><td style="padding: 8px 0; color: #333; font-weight: 600;">${purchase.medicineName}</td></tr>
                    <tr><td style="padding: 8px 0; color: #666; font-weight: 500;">Quantity:</td><td style="padding: 8px 0; color: #333; font-weight: 600;">${purchase.quantity} units</td></tr>
                    <tr><td style="padding: 8px 0; color: #666; font-weight: 500;">Status:</td><td style="padding: 8px 0;"><span style="background: ${status === 'confirmed' ? '#e8f5e8' : status === 'delivered' ? '#e3f2fd' : '#ffebee'}; color: ${status === 'confirmed' ? '#2E7D32' : status === 'delivered' ? '#1976D2' : '#D32F2F'}; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${status === 'confirmed' ? '✅ CONFIRMED' : status === 'delivered' ? '🚚 DELIVERED' : '❌ FAILED'}</span></td></tr>
                  </table>
                </div>
                
                ${status === 'confirmed' ? `<div style="background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%); border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #4CAF50;"><h4 style="color: #2E7D32; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">🚚 Next Steps</h4><p style="color: #666; margin: 0; line-height: 1.6;">Your order is being prepared for delivery. You'll receive tracking information once it's dispatched.</p></div>` : ''}
                
                ${status === 'delivered' ? `<div style="background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%); border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #2196F3;"><h4 style="color: #1976D2; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">🙏 Thank You!</h4><p style="color: #666; margin: 0; line-height: 1.6;">We hope our service met your expectations. Feel free to contact us if you need any assistance.</p></div>` : ''}
                
                ${status === 'failed' ? `<div style="background: linear-gradient(135deg, #ffebee 0%, #ffffff 100%); border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #FF5722;"><h4 style="color: #D32F2F; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">📞 Need Help?</h4><p style="color: #666; margin: 0; line-height: 1.6;">Please contact our pharmacy team for assistance. We're here to help resolve any issues with your prescription.</p></div>` : ''}
                
                <div style="text-align: center; margin: 30px 0;">
                  <div style="border-top: 2px solid #f0f0f0; padding-top: 20px;">
                    <p style="color: #333; margin: 0; font-weight: 600;">Best regards,</p>
                    <p style="color: #228B22; margin: 5px 0 0 0; font-weight: 700; font-size: 16px;">The Intare Pharmacy Team</p>
                  </div>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">📧 This email was sent to ${purchase.customerEmail}</p>
                <p style="color: #999; margin: 0; font-size: 12px;">© 2024 Intare Pharmacy. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
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