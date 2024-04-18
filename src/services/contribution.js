const Contribution = require("../models/contribution");
const RecycleBinService = require("./recycleBin");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const sendEmail = require("../email/email");
const Beneficiary = require("../models/benefiiciary");
async function addContribution(data) {
  try {
    const user = await User.findById(data.user);
    const ben = await Beneficiary.findById(data.user);
    let name;
    if (user) {
      data.firstName = user.firstName;
      data.lastName = user.lastName;
      data.gender = user.gender;
      data.age = calculateAge(user.dateBorn, data.died);
      data.born = user.dateBorn;
      name = `${user.firstName} ${user.lastName}`;
    } else if (ben) {
      data.firstName = ben.firstName;
      data.lastName = ben.lastName;
      data.gender = ben.gender;
      data.age = calculateAge(ben.born, data.died);
      data.born = ben.born;
      name = `${ben.firstName} ${ben.lastName}`;
    }
    const users = await User.find();

    function isValidEmail(email) {
      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    for (const user of users) {
      // Check if any of the required data is null
      if (
        name &&
        data &&
        data.amount &&
        data.deadLine &&
        user &&
        user.email &&
        isValidEmail(user.email) // Check if the email is valid
      ) {
        // If all required data is present and the email is valid, send the email
        await sendEmail(name, data.amount, data.deadLine, user.email);
      } else {
        // Log or handle the case where data is missing or the email is invalid
        console.log(
          "Invalid email or missing data for sending email to user:",
          user
        );
        // You can also choose to skip this user or handle it differently
      }
    }
    const contribution = await Contribution.create(data);
    return contribution;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
function calculateAge(dateBorn, died) {
  const born = new Date(dateBorn);
  const death = new Date(died);
  let age = death.getFullYear() - born.getFullYear();
  const m = death.getMonth() - born.getMonth();

  // If the current month is before the birth month, or
  // it's the same month but the current day is before the birth day, decrease the age by 1
  if (m < 0 || (m === 0 && death.getDate() < born.getDate())) {
    age--;
  }

  return age;
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
