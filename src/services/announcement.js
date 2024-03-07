const Announcement = require("../models/announcement");

async function get() {
  try {
    return await Announcement.find();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
const AnnouncementService = {
  get,
};
module.exports = AnnouncementService;
