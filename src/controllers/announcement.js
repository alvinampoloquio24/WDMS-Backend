const AnnouncementService = require("../services/announcement");
const AnnouncementDb = require("../models/announcement");
const Beneficiary = require("../models/benefiiciary");
const getAnnouncement = async function (req, res, next) {
  try {
    const announcements = await AnnouncementService.get();
    return res.status(200).json(announcements);
  } catch (error) {
    return next(error);
  }
};

const addBeneficiary = async function (req, res, next) {
  try {
    const data = req.body;
    data.owner = req.user._id;
    const beneficiary = await Beneficiary.create(data);

    return res.status(200).json(beneficiary);
  } catch (error) {
    return next(error);
  }
};
const editBeneficiary = async function (req, res, next) {
  try {
    const id = req.params.id;
    const beneficiary = await Beneficiary.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!beneficiary) {
      return res.status(400).json({ message: "Not found. " });
    }
    return res.status(200).json(beneficiary);
  } catch (error) {
    return next(error);
  }
};
const deleteBeneficiary = async function (req, res, next) {
  try {
    const id = req.params.id;
    const beneficiary = await Beneficiary.findByIdAndDelete(id);
    if (!beneficiary) {
      return res.status(400).json({ message: "Not found. " });
    }
    return res.status(200).json(beneficiary);
  } catch (error) {
    return next(error);
  }
};
const getBeneficiary = async function (req, res, next) {
  try {
    const leader = await Beneficiary.findOne({
      owner: req.user._id,
      role: "leader",
    });
    const beneficiary = await Beneficiary.find({ owner: req.user._id });
    return res.status(200).json({ leader, beneficiary });
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
  getBeneficiary,
  deleteBeneficiary,
  editBeneficiary,
  addBeneficiary,
};

module.exports = Announcement;
