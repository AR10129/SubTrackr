import nodemailer from 'nodemailer';

import { EMAIL_USER, EMAIL_PASSWORD } from './env.js'

export const accountEmail = EMAIL_USER || 'your-email@gmail.com';

let transporter = null;

// Only create transporter if email credentials are configured
if (EMAIL_USER && EMAIL_PASSWORD && !EMAIL_PASSWORD.includes('placeholder')) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: accountEmail,
      pass: EMAIL_PASSWORD
    }
  });
}

export default transporter;