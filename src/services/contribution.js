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
async function getCountdown(deadline) {
  try {
    const currentDate = new Date(); // Get the current date
    const deadlineDate = new Date(deadline); // Convert deadline string to Date object
    const timeDiff = deadlineDate.getTime() - currentDate.getTime(); // Calculate the difference in milliseconds
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

    if (daysDiff <= 0) {
      return 0;
    }
    return daysDiff; // Return the number of days before the deadline
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
