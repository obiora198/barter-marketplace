import { createTransport } from "nodemailer";

export const transporter = createTransport({
  host: process.env.NEXT_PUBLIC_EMAIL_SERVER_HOST,
  port: parseInt(process.env.NEXT_PUBLIC_EMAIL_SERVER_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_SERVER_USER,
    pass: process.env.NEXT_PUBLIC_EMAIL_SERVER_PASSWORD,
  },
});

export const emailConfig = {
  from: process.env.NEXT_PUBLIC_EMAIL_FROM,
};