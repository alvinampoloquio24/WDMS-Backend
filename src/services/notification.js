const Contribution = require("../models/contribution");
const Announcement = require("../models/announcement");

// Schedule tasks to be run on the server.

const Notification = async function () {
  // const today = new Date(); // Get the current date

  const contributions = await Contribution.find({ countDown: { $gt: 0 } });
  for (const contribution of contributions) {
    await Contribution.findByIdAndUpdate(contribution._id, {
      $inc: { countDown: -1 },
    });
  }

  const upcomingDeadlines = await Contribution.find({ countDown: 3 });
  console.log(upcomingDeadlines);

  for (const upcomingDeadline of upcomingDeadlines) {
    await Announcement.create({
      subject: "Deadline",
      content: {
        contribution: upcomingDeadline,
        message: "Deadline is upcoming",
      },
    });
  }
};
module.exports = Notification;
