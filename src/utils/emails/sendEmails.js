import nodemailer from "nodemailer";

const sendEmails = async ({ to, subject, html }) => {
  // transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  // reciver
  const info = await transporter.sendMail({
    from: `"Saraha Application" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  return info.rejected.length == 0 ? true : false;
};

export const subjects = {
  register: "Activate Mail",
};
export default sendEmails;
