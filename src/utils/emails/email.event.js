import { EventEmitter } from "node:events";
import jwt from "jsonwebtoken";
import { signUp } from "./generateHTML.js";
import sendEmails, { subjects } from "./sendEmails.js";
export const emailEmmiter = new EventEmitter();

emailEmmiter.on("sendEmail", async (email) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  const link = `http://localhost:3000/auth/acctivate_account/${token}`;
  await sendEmails({
    to: email,
    subject: subjects.register,
    html: signUp(link),
  });
});
