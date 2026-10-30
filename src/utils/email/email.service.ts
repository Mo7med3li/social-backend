import nodemailer from "nodemailer";
import { SendMailOptions } from "nodemailer";
import { EventEmitter } from "stream";

type SendEmailParams = {
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: SendMailOptions["attachments"];
};

export const sendEmail = async ({
  from = process.env.APP_EMAIL,
  to = "",
  subject = "Social App",
  text = "",
  html = "",
  cc = [],
  bcc = [],
  attachments = [],
}: SendEmailParams) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Social App" <${from}>`,
      to,
      subject,
      cc,
      bcc,
      text,
      html,
      attachments,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Nodemailer sendMail error:", error);
    throw error;
  }
};
const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", sendEmail);

export { emailEmitter };
