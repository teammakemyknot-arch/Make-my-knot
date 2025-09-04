const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use your preferred email service in production
    return nodemailer.createTransporter({
      service: 'gmail', // or 'SendGrid', 'Mailgun', etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Use Ethereal Email for development testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

const sendEmail = async (options) => {
  // Create transporter
  const transporter = createTransporter();

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'MakeMyKnot <noreply@makemyknot.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email sent successfully!');
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  welcomeEmail: (firstName, verifyURL) => ({
    subject: 'Welcome to MakeMyKnot! Please verify your email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #ff4458, #ff6b7a); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MakeMyKnot!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Find your perfect match</p>
        </div>
        
        <div style="padding: 40px 20px; background-color: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${firstName}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining MakeMyKnot! We're excited to help you find meaningful connections.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            To get started, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyURL}" style="background-color: #ff4458; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #ff4458; font-size: 14px; word-break: break-all;">
            ${verifyURL}
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This link will expire in 24 hours. If you didn't create an account with MakeMyKnot, please ignore this email.
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <p style="color: #666; margin: 0; font-size: 14px;">
            Best regards,<br>
            The MakeMyKnot Team ❤️
          </p>
        </div>
      </div>
    `
  }),

  passwordResetEmail: (firstName, resetURL) => ({
    subject: 'Reset your MakeMyKnot password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background-color: #ff4458; padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset</h1>
        </div>
        
        <div style="padding: 40px 20px; background-color: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${firstName}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You requested a password reset for your MakeMyKnot account.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background-color: #ff4458; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #ff4458; font-size: 14px; word-break: break-all;">
            ${resetURL}
          </p>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-top: 30px;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              ⚠️ This link will expire in 10 minutes for security reasons.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <p style="color: #666; margin: 0; font-size: 14px;">
            Best regards,<br>
            The MakeMyKnot Team 🔐
          </p>
        </div>
      </div>
    `
  }),

  newMatchEmail: (userName, matchName, matchPhoto) => ({
    subject: '🎉 You have a new match!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #ff4458, #ff6b7a); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 It's a Match!</h1>
        </div>
        
        <div style="padding: 40px 20px; background-color: white; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${userName}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Great news! You and ${matchName} liked each other. Start chatting now!
          </p>
          
          ${matchPhoto ? `<img src="${matchPhoto}" alt="${matchName}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 20px 0;">` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #ff4458; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              Start Chatting
            </a>
          </div>
        </div>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};
