import nodemailer from "nodemailer";
import config from "../app/config";

const emailSend = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.sender_email,
      pass: config.email_secret,
    },
  });

  const info = await transporter.sendMail({
    from: `"PH Health Care" ${config.sender_email}`,
    to: email,
    subject: "Reset Password",

    html,
  });

  console.log("Message sent: %s", info.messageId);
};

export default emailSend;
