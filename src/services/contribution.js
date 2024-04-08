const Contribution = require("../models/contribution");
const RecycleBinService = require("./recycleBin");
const User = require("../models/user");
const Transaction = require("../models/transaction");
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
      return await Contribution.find().sort({ date: -1 });
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
async function getUserUnpaidContribution() {
  try {
    let unpaidUsers = []; // This will store users along with their unpaid contributions

    const users = await User.find();
    const contributions = await Contribution.find();

    for (const user of users) {
      let unpaidContributionsForUser = []; // Track unpaid contributions for this user

      for (const contribution of contributions) {
        const transactions = await Transaction.find({
          "contribution._id": contribution._id,
          userId: user._id,
        });

        // If no transaction is found for this contribution, it means the user hasn't paid
        if (transactions.length === 0) {
          unpaidContributionsForUser.push({
            contributionId: contribution._id,
            name: `${contribution.firstName} ${contribution.lastName}`,
            deadline: contribution.deadLine,
          });
        }
      }

      // If this user has any unpaid contributions, add them to the unpaidUsers list
      if (unpaidContributionsForUser.length > 0) {
        unpaidUsers.push({
          userId: user._id,
          name: `${user.firstName} ${user.lastName}`, // Assuming 'name' is a property of the User model
          unpaidContributions: unpaidContributionsForUser,
        });
      }
    }

    return unpaidUsers; // Return or process the list of users with their unpaid contributions
  } catch (error) {
    console.error("Failed to get users with unpaid contributions", error);
    throw error; // Rethrow or handle the error as needed
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
  getUserUnpaidContribution,
};
module.exports = ContributionService;
