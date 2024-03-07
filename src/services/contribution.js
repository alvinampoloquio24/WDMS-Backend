const Contribution = require("../models/contribution");
const RecycleBinService = require("./recycleBin");

async function addContribution(data) {
  try {
    return await Contribution.create(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getContribution(params) {
  try {
    if (params) {
      return await Contribution.find(params);
    } else {
      return await Contribution.find();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getContributionById(id) {
  try {
    return await Contribution.findById(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function editContribution(id, update) {
  try {
    let contribution = await Contribution.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!contribution) {
      return null;
    }
    contribution.countDown = await getCountdown(contribution._id);
    return contribution;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function deleteContribution(id) {
  try {
    const contribution = await Contribution.findByIdAndDelete(id, {
      new: true,
    });
    if (!contribution) {
      return null;
    }

    await RecycleBinService.create("Contribution", contribution);

    return contribution;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function findContributionById(id) {
  try {
    return await Contribution.findById(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getCountdown(id) {
  try {
    // Find the contribution by its ID
    const contribution = await Contribution.findOne({ _id: id });

    // Calculate due date
    const daysBeforeDeadline = contribution.daysAgo || 0;
    const dueDate = new Date(contribution.deadLine);
    dueDate.setDate(dueDate.getDate() - daysBeforeDeadline);

    // Calculate countDown (number of days remaining until the due date)
    const currentDate = new Date();
    let countDown = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    if (countDown <= 0) {
      countDown = 0;
    }

    return countDown;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const ContributionService = {
  getCountdown,
  addContribution,
  getContributionById,
  getContribution,
  editContribution,
  deleteContribution,
  findContributionById,
};
module.exports = ContributionService;
