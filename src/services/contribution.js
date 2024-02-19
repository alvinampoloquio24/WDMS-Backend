const Contribution = require("../models/contribution");

async function addContribution(data) {
  try {
    return await Contribution.create(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getContribution() {
  try {
    return await Contribution.find();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function editContribution(id, update) {
  try {
    return await Contribution.findByIdAndUpdate(id, update, { new: true });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function deleteContribution(id) {
  try {
    return await Contribution.findByIdAndDelete(id, { new: true });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
const ContributionService = {
  addContribution,
  getContribution,
  editContribution,
  deleteContribution,
};
module.exports = ContributionService;
