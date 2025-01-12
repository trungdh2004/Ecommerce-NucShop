import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendToMail = async (
  to: string,
  subject: string,
  data: any,
  from: string = process.env.EMAIL!,
  template: string = "/requestOTP.ejs"
) => {
  ejs.renderFile(__dirname + template, data, (err, data) => {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: data,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Thất bại");
      } else {
        console.log("Thành công");
      }
    });
  });
};

export default sendToMail;
