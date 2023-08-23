const cron = require("node-cron");
const sendEmail = require("./nodemailer");
const Task = require("../models/task");
const logger = require("./logger");

// cron job to send email reminders every day at 8am
const emailReminder = cron.schedule("* * * * *", async () => {
  try {
    console.log("emailReminder");
    // grab tasks from database that have emailAlert set to true and emailSent set to false
    const tasks = await Task.find({ emailAlert: true, emailSent: false });
    // if there are tasks that are due in less than 7 days, send an email reminder
    tasks.forEach((task) => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (daysDiff <= 7 && daysDiff >= 0) {
          sendEmail({
            to: process.env.GMAIL_EMAIL,
            subject: `Task Reminder: ${task.name}`,
            text: `This is a reminder that your task ${task.name} is due in ${daysDiff} days. The description of the task is: ${task.description}`,
          });
          // once an email has been sent, set emailSent to true so that it is not sent again
          // eslint-disable-next-line no-param-reassign
          task.emailSent = true;
          task.save();
        }
      }
    });
  } catch (error) {
    logger.error(error);
  }
});

module.exports = emailReminder;
