const RecycleBinService = require("../services/recycleBin");

const findAll = async (req, res, next) => {
  try {
    let recycleBins;
    const dataType = req.query.dataType;

    if (dataType) {
      recycleBins = await RecycleBinService.findAll(dataType);
    } else {
      recycleBins = await RecycleBinService.findAll();
    }
    return res.status(200).json(recycleBins);
  } catch (error) {
    return next(error);
  }
};
const permanentDelete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await RecycleBinService.permanentDelete(id);
    if (!data) {
      return res.status(400).json({ message: "Id not exist. " });
    }
    return res.status(200).json({ message: "Delete Successfully", data });
  } catch (error) {
    return next(error);
  }
};
const restoreData = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await RecycleBinService.retriveData(id);
    if (!data) {
      return res.status(400).json({ message: "Id not Exist. " });
    }
    return res.status(200).json({ message: "Restore Successfully", data });
  } catch (error) {
    return next(error);
  }
};
const RecycleBin = {
  permanentDelete,
  findAll,
  restoreData,
};
module.exports = RecycleBin;
