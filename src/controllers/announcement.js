const AnnouncementService = require("../services/announcement");
const AnnouncementDb = require("../models/announcement");
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
const deleteAnnouncement = async function (req, res, next) {
  try {
    const a = await AnnouncementDb.findByIdAndDelete(req.params.id);
    if (!a) {
      return res.status(400).json({ message: "No Annoncement" });
    }
    return res
      .status(200)
      .json({ message: "Delete Successfully", annoncement: a });
  } catch (error) {
    return next(error);
  }
};
const Announcement = {
  getAnnouncement,
  createAnnouncement,
  deleteAnnouncement,
};

module.exports = Announcement;
