const Contribution = require("../models/contribution");
const Announcement = require("../models/announcement");
const ContributionService = require("./contribution");
const deadlineEmail = require("../email/deadline");
const User = require("../models/user");

// Schedule tasks to be run on the server.

const Notification = async function () {
  // const today = new Date(); // Get the current date

  // const contributions = await Contribution.find({ countDown: { $gt: 0 } });
  // for (const contribution of contributions) {
  //   await Contribution.findByIdAndUpdate(contribution._id, {
  //     $inc: { countDown: -1 },
  //   });
  // }
  const upcomingDeadlines = await Contribution.find({ countDown: 1 });
  for (const upcomingDeadline of upcomingDeadlines) {
    const users = await User.find({ email: { $exists: true, $ne: "" } });

    for (const user of users) {
      // Check if the email is valid
      if (!isValidEmail(user.email)) {
        console.log(`Invalid email address: ${user.email}. Skipping...`);
        continue; // Skip this user and proceed to the next one
      }

      // If the email is valid, proceed to send the email
      await deadlineEmail(
        `${upcomingDeadline.firstName} ${upcomingDeadline.lastName}`,
        upcomingDeadline.amount,
        upcomingDeadline.deadLine,
        user.email
      );
      console.log(`Email sent to ${user.email}`);
    }

    // Function to validate email address
    function isValidEmail(email) {
      // This is a basic regex pattern for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }

  // const contributions = await Contribution.find();
  // for (const contribution of contributions) {
  //   const countDown = await ContributionService.getCountdown(
  //     contribution.deadLine
  //   );
  //   if (countDown === 3) {
  //     const upcomingDeadline = contribution;
  //     await Announcement.create({
  //       subject: "Deadline",
  //       content: {
  //         contribution: upcomingDeadline,
  //         message: "Deadline is upcoming",
  //       },
  //     });
  //   }
  // }
};
module.exports = Notification;
