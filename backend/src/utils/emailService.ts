import nodemailer from 'nodemailer';

export const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"FlowSphere AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'FlowSphere AI - Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
        <h2 style="color: #6366f1; text-align: center;">FlowSphere AI</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; background: #f1f5f9; padding: 10px 20px; border-radius: 8px;">${otp}</span>
        </div>
        <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; 2026 FlowSphere AI Team. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
