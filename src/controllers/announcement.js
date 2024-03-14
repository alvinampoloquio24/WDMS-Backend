const AnnouncementService = require("../services/announcement");

const getAnnouncement = async function (req, res, next) {
  try {
    const announcements = await AnnouncementService.get();
    return res.status(200).json(announcements);
  } catch (error) {
    return next(error);
  }
};
const createAnnouncement = async function (req, res, next) {
  try {
    const announcement = await AnnouncementService.create(req.body);
    return res.status(200).json(announcement);
  } catch (error) {
    return next(error);
  }
};

const Announcement = {
  getAnnouncement,
  createAnnouncement,
};

module.exports = Announcement;
