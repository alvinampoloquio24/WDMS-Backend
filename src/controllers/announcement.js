const AnnouncementService = require("../services/announcement");

const getAnnouncement = async function (req, res) {
  try {
    const announcements = await AnnouncementService.get();
    return res.status(200).json(announcements);
  } catch (error) {
    throw error;
  }
};

const Announcement = {
  getAnnouncement,
};

module.exports = Announcement;
