const nodeMailer = require("nodemailer");
const { google } = require("googleapis");

const { OAuth2 } = google.auth;
const logger = require("./logger");

const createTransport = async () => {
  // oauth2Client is used to generate an access token
  const oauth2Client = new OAuth2(
    process.env.GMAIL_API_CLIENT_ID,
    process.env.GMAIL_API_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground",
  );

  // set refresh token to generate new access tokens when needed
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  // generate new access token
  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  }).catch((err) => {
    logger.error(err);
  });

  // transporter is used to send emails using gmail smtp server
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_EMAIL,
      accessToken,
      clientId: process.env.GMAIL_API_CLIENT_ID,
      clientSecret: process.env.GMAIL_API_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendEmail = async (options) => {
  const transporter = await createTransport();

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: process.env.GMAIL_EMAIL,
    subject: "Testing",
    text: "Testing you",
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
