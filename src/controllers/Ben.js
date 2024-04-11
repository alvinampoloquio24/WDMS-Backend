const Beneficiary = require("../models/benefiiciary");

const addBeneficiary = async function (req, res, next) {
  try {
    console.log(req.body, "asdsa");
    // if (data.role) {
    //   data.role = "leader";
    // }
    const data = req.body;
    data.owner = req.user._id;
    const beneficiary = await Beneficiary.create(data);

    console.log(beneficiary);
    return res.status(200).json(beneficiary);
  } catch (error) {
    console.log(error);
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
    const beneficiary = await Beneficiary.find({
      owner: req.user._id,
      role: "beneficiary",
    });
    return res.status(200).json(beneficiary);
  } catch (error) {
    return next(error);
  }
};
const getBeneficiary2 = async function (req, res, next) {
  try {
    const leader = await Beneficiary.find({
      owner: req.user._id,
      role: "leader",
    });
    return res.status(200).json(leader);
  } catch (error) {
    return next(error);
  }
};
const Ben = {
  getBeneficiary,
  deleteBeneficiary,
  editBeneficiary,
  addBeneficiary,
  getBeneficiary2,
};

module.exports = Ben;
