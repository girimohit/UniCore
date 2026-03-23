import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// The transporter will attempt OAuth2 if GOOGLE_REFRESH_TOKEN is present, 
// otherwise it falls back to standard SMTP (App Password)
const transporter = nodemailer.createTransport(
  process.env.GOOGLE_REFRESH_TOKEN 
    ? {
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.GMAIL_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
      }
    : {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER || process.env.GMAIL_USER,
          pass: process.env.SMTP_PASS,
        },
      }
);

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export function getInviteEmailTemplate(institutionName: string, inviteLink: string, role: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4f46e5;">Welcome to ${institutionName}!</h2>
      <p>Greetings,</p>
      <p>You have been invited to join the <strong>${role}</strong> portal of ${institutionName}.</p>
      <div style="margin: 30px 0;">
        <a href="${inviteLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Accept Invitation & Set Password
        </a>
      </div>
      <p style="font-size: 14px; color: #666;">If the button above doesn't work, copy and paste this link in your browser:</p>
      <p style="font-size: 14px; color: #4f46e5; word-break: break-all;">${inviteLink}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #999;">This invitation was sent by an administrator of ${institutionName}. It will expire in 48 hours.</p>
    </div>
  `;
}

export function getStudentActivationEmailTemplate(institutionName: string, activationLink: string, name: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #10b981;">Account Created: ${institutionName}</h2>
      <p>Dear ${name},</p>
      <p>An account has been created for you at <strong>${institutionName} Student Portal</strong>.</p>
      <p>Please activate your account and set your login password using the link below:</p>
      <div style="margin: 30px 0;">
        <a href="${activationLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Activate My Account
        </a>
      </div>
      <p style="font-size: 14px; color: #666;">If the button above doesn't work, copy and paste this link in your browser:</p>
      <p style="font-size: 14px; color: #10b981; word-break: break-all;">${activationLink}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply.</p>
    </div>
  `;
}

export function getFacultyWelcomeEmailTemplate(institutionName: string, identifier: string, tempPass: string, loginLink: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #3b82f6;">Welcome to the Faculty Portal</h2>
      <p>You have been registered as a Faculty member at <strong>${institutionName}</strong>.</p>
      <p>Your temporary login credentials are as follows:</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 5px 0;"><strong>Identifier:</strong> ${identifier}</p>
        <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 4px; border-radius: 4px;">${tempPass}</code></p>
      </div>
      <p>Please log in and reset your password immediately at:</p>
      <p><a href="${loginLink}" style="color: #3b82f6; font-weight: bold;">${loginLink}</a></p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 12px; color: #999;">If you did not expect this email, please contact your IT department.</p>
    </div>
  `;
}
