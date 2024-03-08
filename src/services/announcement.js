const Announcement = require("../models/announcement");

async function get() {
  try {
    return await Announcement.find();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function create(data) {
  try {
    const announcement = await Announcement.create(data);
    return announcement;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
const AnnouncementService = {
  get,
  create,
};
module.exports = AnnouncementService;
