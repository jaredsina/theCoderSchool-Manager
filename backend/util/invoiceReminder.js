const cron = require("node-cron");
const sendEmail = require("./nodemailer");
const Program = require("../models/program");
const logger = require("./logger");

const startInvoiceReminder = () => {
  // cron job to send check if invoices are due every monday at 8am
  const invoiceReminder = cron.schedule("0 8 * * 1", async () => {
    try {
      logger.info("invoice reminder running");
      // grab programs that have not been paid and are due in less than 7 days or are overdue
      const programs = await Program.find({
        invoicePaid: false,
        invoice: {
          $lte: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // due in less than 7 days or overdue
        },
      });

      // calculate the number of days until the invoice is due
      programs.forEach((program) => {
        const dueDate = new Date(program.invoice);
        const today = new Date();
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // if the invoice is due in less than a week and the email has not been sent, send an email
        if (daysDiff <= 7 && daysDiff >= 0) {
          logger.info(`7 days invoice email sent for: ${program.name}`);
          sendEmail({
            to: process.env.GMAIL_EMAIL,
            subject: `Invoice Reminder: ${program.name}`,
            text: `This is a reminder that your invoice for ${program.name} is due in ${daysDiff} days. Once an invoice has been paid make sure to update the programs invoice paid status to stop receiving these emails.`,
          });
        }
        // if the invoice is overdue send an email
        if (daysDiff < 0) {
          logger.info(`Invoice overdue email sent for: ${program.name}`);
          sendEmail({
            to: process.env.GMAIL_EMAIL,
            subject: `Invoice Reminder: ${program.name}`,
            text: `This is a reminder that your invoice for ${program.name} is overdue. Once an invoice has been paid make sure to update the programs invoice paid status to stop receiving these emails.`,
          });
        }
      });

      if (programs.length === 0) {
        logger.info("No invoice emails sent");
      }
    } catch (error) {
      logger.error(error);
    }
  });
  invoiceReminder.start();
};
module.exports = startInvoiceReminder;
