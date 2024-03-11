const Contribution = require("../models/contribution");
const Announcement = require("../models/announcement");
const ContributionService = require("./contribution");

// Schedule tasks to be run on the server.

const Notification = async function () {
  // const today = new Date(); // Get the current date

  // const contributions = await Contribution.find({ countDown: { $gt: 0 } });
  // for (const contribution of contributions) {
  //   await Contribution.findByIdAndUpdate(contribution._id, {
  //     $inc: { countDown: -1 },
  //   });
  // }
  // const upcomingDeadlines = await Contribution.find({ countDown: 3 });
  // for (const upcomingDeadline of upcomingDeadlines) {
  //   await Announcement.create({
  //     subject: "Deadline",
  //     content: {
  //       contribution: upcomingDeadline,
  //       message: "Deadline is upcoming",
  //     },
  //   });
  // }

  const contributions = await Contribution.find();
  for (const contribution of contributions) {
    const countDown = await ContributionService.getCountdown(
      contribution.deadLine
    );
    if (countDown === 3) {
      const upcomingDeadline = contribution;
      await Announcement.create({
        subject: "Deadline",
        content: {
          contribution: upcomingDeadline,
          message: "Deadline is upcoming",
        },
      });
    }
  }
};
module.exports = Notification;
