import nodemailer from 'nodemailer';
import { config } from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"Centillion Gateway" <${config.email.from}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendVerificationEmail(email: string, verificationToken: string, userName: string): Promise<void> {
    const verificationUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Centillion Gateway</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌏 Centillion Gateway</h1>
          <h2>Welcome to Your Beauty Journey!</h2>
        </div>
        <div class="content">
          <h3>Hello ${userName},</h3>
          <p>Thank you for registering with Centillion Gateway! We're excited to help you discover the best beauty enhancement services across Sri Lanka, India, and Thailand.</p>

          <p>To complete your registration and access your dashboard, please verify your email address by clicking the button below:</p>

          <a href="${verificationUrl}" class="button">Verify My Email</a>

          <p><strong>Important:</strong> After verification, you'll be able to log in to your account. On your first login, you'll be required to set a new password for security.</p>

          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">${verificationUrl}</p>

          <p>This verification link will expire in 24 hours for security reasons.</p>

          <p>If you didn't create an account with Centillion Gateway, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>The Centillion Gateway Team</p>
          <p>Connecting travelers with life-changing experiences across Asia</p>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to Centillion Gateway, ${userName}!

      Thank you for registering! To complete your registration, please verify your email by visiting:
      ${verificationUrl}

      After verification, you can log in to your account. On your first login, you'll need to set a new password.

      This link will expire in 24 hours.

      If you didn't create this account, please ignore this email.

      Best regards,
      The Centillion Gateway Team
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - Centillion Gateway',
      html,
      text,
    });
  }
}

export default new EmailService();
