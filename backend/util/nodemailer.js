const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "",
      pass: "",
    },
  });

  const mailOptions = {
    from: "@gmail.com",
    to: "@gmail.com",
    subject: "",
    text: "",
  };

  const response = await transporter.sendMail(mailOptions);
  console.log(response);
};

module.exports = sendEmail;
