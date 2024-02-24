const ContributionService = require("../services/contribution");
const TransactionService = require("../services/transaction");

const addContribution = async (req, res) => {
  try {
    let contribution = await ContributionService.addContribution(req.body);
    if (!contribution) {
      return res
        .status(400)
        .json({ mesage: "There is a problem creating a contribution. " });
    }
    const countDown = await ContributionService.getCountdown(contribution._id);
    contribution.countDown = countDown;
    return res.status(201).json({ message: "Add Sucessfully", contribution });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getContribution = async (req, res) => {
  try {
    const id = req.user._id;

    // Fetch contributions
    const contributions = await ContributionService.getContribution();

    // Loop through contributions
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
        contribution.status = "paid";
      }
      contribution.countDown = countDown;
    }

    // Return contributions with updated status
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

const Contribution = {
  getContributionById,
  addContribution,
  getContribution,
  editContribution,
  deleteContribution,
};
module.exports = Contribution;
