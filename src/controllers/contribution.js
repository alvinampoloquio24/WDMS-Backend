const ContributionService = require("../services/contribution");
const TransactionService = require("../services/transaction");
const UserService = require("../services/user");

const addContribution = async (req, res) => {
  try {
    let data = req.body;
    data.countDown = await ContributionService.getCountdown(data.deadLine);
    let contribution = await ContributionService.addContribution(data);

    return res.status(201).json({ message: "Add Sucessfully", contribution });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getContribution = async (req, res) => {
  try {
    const id = req.user._id;

    // Fetch user details
    const user = await UserService.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch contributions within the date range
    const contributions = await ContributionService.getContribution();

    // let penaltyCount = 0; // Initialize penalty count

    for (const contribution of contributions) {
      // Check if the contribution exists in the transaction schema
      const countDown = await ContributionService.getCountdown(
        contribution._id
      );

      const transaction = await TransactionService.findTransaction({
        "contribution._id": contribution._id,
        userId: id,
      });

      if (transaction) {
        contribution.status = transaction.status;
      } else {
        contribution.status = "pending";
      }
      contribution.countDown = countDown;
    }

    return res.status(200).json(contributions);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
const getContributionById = async (req, res) => {
  try {
    const id = req.user._id;
    const contributionId = req.params.id;

    // Fetch contributions
    const contribution = await ContributionService.getContributionById(
      contributionId
    );
    if (!contribution) {
      return res
        .status(400)
        .json({ message: "There is no contribution in provided Id. " });
    }

    // Check if the contribution exists in the transaction schema
    const transaction = await TransactionService.findTransaction({
      "contribution._id": contribution._id,
      userId: id,
    });
    if (transaction) {
      contribution.status = "paid";
    }

    // Return contributions with updated status
    return res.status(200).json(contribution);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
const editContribution = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;

    // Update the contribution
    const updatedContribution = await ContributionService.editContribution(
      id,
      update
    );
    if (!updatedContribution) {
      return res
        .status(400)
        .json({ message: "No contribution with provided id." });
    }

    return res.status(200).json({
      message: "Update Successfully.",
      contribution: updatedContribution,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteContribution = async (req, res) => {
  try {
    const id = req.params.id;
    const contribution = await ContributionService.deleteContribution(id);
    if (!contribution) {
      return res
        .status(400)
        .json({ message: "No constrinution with provided id. " });
    }
    return res
      .status(200)
      .json({ message: "Delete Successfully. ", contribution });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getAllContribution = async (req, res) => {
  try {
    const contributions = await ContributionService.getContribution();
    return res.status(200).json(contributions);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const Contribution = {
  getContributionById,
  addContribution,
  getContribution,
  editContribution,
  deleteContribution,
  getAllContribution,
};
module.exports = Contribution;
