const nodemailer = require("nodemailer");

exports.sendEmailService = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: { name: "HuuLoc", address: process.env.MAIL_USERNAME }, // sender address
    to: email, // list of receivers
    subject: "✔✔ Email ✔✔ ", // Subject line
    text: "Hello world?", // plain text body
    html: `Your Code: <b>${code}</b>`, // html body
  });
  return info;
};
