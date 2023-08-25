/* eslint-disable no-param-reassign */
const cron = require("node-cron");
const sendEmail = require("./nodemailer");
const Task = require("../models/task");
const logger = require("./logger");

// cron job to send email reminders every day at 8am
const emailReminder = cron.schedule("0 8 * * *", async () => {
  try {
    // grab tasks that have either sevenDayEmailSent, threeDayEmailSent, oneDayEmailSent, or sameDayEmailSent set to false
    const tasks = await Task.find({
      $or: [
        { sevenDayEmailSent: false },
        { threeDayEmailSent: false },
        { oneDayEmailSent: false },
        { sameDayEmailSent: false },
      ],
    });
    // if there are tasks that are due in less than 7 days, send an email reminder
    tasks.forEach((task) => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // if the task is due in less than a week and the email has not been sent, send an email
        if (
          daysDiff <= 7 &&
          daysDiff >= 0 &&
          task.sevenDayEmailSent === false
        ) {
          sendEmail({
            to: process.env.GMAIL_EMAIL,
            subject: `Task Reminder: ${task.name}`,
            text: `This is a reminder that your task ${task.name} is due in ${daysDiff} days. The description of the task is: ${task.description}`,
          });
          logger.info(`7 days email sent for: ${task.name}`);
          // once an email has been sent, set emailSent to true so that it is not sent again
          task.sevenDayEmailSent = true;
        }
        // if the task is due in less than 3 days and the email has not been sent, send an email
        if (
          daysDiff <= 3 &&
          daysDiff >= 0 &&
          task.threeDayEmailSent === false
        ) {
          logger.info(`3 days email sent for: ${task.name}`);
          sendEmail({
            to: process.env.GMAIL_EMAIL,
            subject: `Task Reminder: ${task.name}`,
            text: `This is a reminder that your task ${task.name} is due in ${daysDiff} days. The description of the task is: ${task.description}`,
          });
          task.threeDayEmailSent = true;
        }
        // if the task is due in less than a day and the email has not been sent, send an email
        if (daysDiff <= 1 && daysDiff >= 0 && task.oneDayEmailSent === false) {
          logger.info(`1 day email sent for: ${task.name}`);
          sendEmail({
            to: process.env.GMAIL_EMAIL,
            subject: `Task Reminder: ${task.name}`,
            text: `This is a reminder that your task ${task.name} is due in ${daysDiff} days. The description of the task is: ${task.description}`,
          });
          task.oneDayEmailSent = true;
        }
        // if the task is due today and the email has not been sent, send an email
        if (daysDiff === 0 && task.sameDayEmailSent === false) {
          logger.info(`same day email sent for: ${task.name}`);
          sendEmail({
            to: process.env.GMAIL_EMAIL,
            subject: `Task Reminder: ${task.name}`,
            text: `This is a reminder that your task ${task.name} is due today. The description of the task is: ${task.description}`,
          });
          task.sameDayEmailSent = true;
        }
        // save the task with any changes
        task.save();
      }
    });
  } catch (error) {
    logger.error(error);
  }
});

module.exports = emailReminder;
