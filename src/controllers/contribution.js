const ContributionService = require("../services/contribution");

const addContribution = async (req, res) => {
  try {
    const constribution = await ContributionService.addContribution(req.body);

    return res.status(201).json({ message: "Add Sucessfully", constribution });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getContribution = async (req, res) => {
  try {
    const contributions = await ContributionService.getContribution();
    return res.status(200).json(contributions);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const editContribution = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const contribution = await ContributionService.editContribution(id, update);
    if (!contribution) {
      return res
        .status(400)
        .json({ message: "No constrinution with provided id. " });
    }
    return res
      .status(200)
      .json({ message: "Update Successfully. ", contribution });
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
  addContribution,
  getContribution,
  editContribution,
  deleteContribution,
};
module.exports = Contribution;
