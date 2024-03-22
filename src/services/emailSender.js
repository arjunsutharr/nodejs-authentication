import Bull from "bull";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { ErrorHandler } from "../utils/errorHandler.js";

// we using bull for sending mails in parallel
const queue = new Bull("password-reset-emails", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

// processing queue
queue.process("send-password-reset", processPasswordResetJob);

// Adding password forgot link in queue
export function sendPasswordResetEmailToQueue(name, email, resetToken) {
  const link = `${process.env.PASSWORD_RESET_BASE_LINK}?token=${resetToken}`;
  return queue.add("send-password-reset", { name, email, link });
}

// Email sending logic
async function processPasswordResetJob(job) {
  try {
    const { name, email, link } = job.data;
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Add your custom CSS styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
            }
            .content {
              margin-top: 20px;
            }
            /* Mobile Responsive Styles */
            @media only screen and (max-width: 600px) {
              .container {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <p>Namaskaram, ${name}</p>
              <p>You have requested to reset your password for your account. To reset your password, Use this link ${link}</p>
              <p>This link is valid for 10 minutes only. If you did not request a password reset, please ignore this email.</p>
              <p>Pranam</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Sent password reset email to ${email}`);
  } catch (error) {
    throw new ErrorHandler(500, "Error while sending password forgort mail");
  }
}

// For creating random Token for password forgot
export async function generatePasswordResetToken(length = 33) {
  const randomBytes = crypto.randomBytes(length);
  const token = randomBytes
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "-")
    .replace(/=/g, "");

  const now = new Date();
  const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
  return { token, expTime: tenMinutesFromNow };
}
