const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Travel Rogue AI!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #2563eb;">Welcome to Travel Rogue AI!</h1>
        <p>Hi ${firstName},</p>
        <p>Welcome to Travel Rogue AI! We're excited to help you plan your next adventure.</p>
        <p>With our AI-powered platform, you can:</p>
        <ul>
          <li>Generate personalized travel itineraries</li>
          <li>Track your travel expenses</li>
          <li>Share plans with friends and family</li>
          <li>Discover amazing destinations</li>
        </ul>
        <p>You've received 2 free credits to get started. Each credit allows you to generate one AI-powered travel plan.</p>
        <p>Happy travels!</p>
        <p>The Travel Rogue AI Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    // Don't throw error to prevent breaking user registration
    console.log('📧 Email failed but registration continues');
  }
};

// Send plan invitation email
const sendPlanInviteEmail = async (email, planName, inviterName, inviteToken) => {
  const transporter = createTransporter();
  const inviteUrl = `${process.env.FRONTEND_URL}/invites/${inviteToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${inviterName} invited you to view their travel plan`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #2563eb;">You're Invited!</h1>
        <p>Hi there!</p>
        <p><strong>${inviterName}</strong> has invited you to view their travel plan for <strong>${planName}</strong>.</p>
        <p>Click the button below to view the travel plan:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Travel Plan</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${inviteUrl}</p>
        <p>This invitation will expire in 7 days.</p>
        <p>Happy travels!</p>
        <p>The Travel Rogue AI Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invite email sent to ${email} for plan ${planName}`);
  } catch (error) {
    console.error('Error sending invite email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, firstName) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password - Travel Rogue AI',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #2563eb;">Reset Your Password</h1>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password for your Travel Rogue AI account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>The Travel Rogue AI Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send feedback acknowledgment email
const sendFeedbackAcknowledgmentEmail = async (email, firstName, feedbackType) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for your feedback - Travel Rogue AI',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #2563eb;">Thank You for Your Feedback!</h1>
        <p>Hi ${firstName},</p>
        <p>Thank you for taking the time to share your ${feedbackType} with us. Your feedback is valuable and helps us improve Travel Rogue AI.</p>
        <p>We've received your message and our team will review it. If a response is needed, we'll get back to you within 24-48 hours.</p>
        <p>We appreciate your support in making Travel Rogue AI better for everyone!</p>
        <p>Best regards,</p>
        <p>The Travel Rogue AI Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Feedback acknowledgment email sent to ${email}`);
  } catch (error) {
    console.error('Error sending feedback acknowledgment email:', error);
    // Don't throw error for acknowledgment emails
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPlanInviteEmail,
  sendPasswordResetEmail,
  sendFeedbackAcknowledgmentEmail
};
