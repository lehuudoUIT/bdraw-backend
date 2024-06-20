import { detailItem, listItem, logAll } from "../services/itemService";

const logAllDb = async (req, res) => {
  let response = await logAll();
  return res.status(200).json(response);
};

const getDetailItem = async (req, res) => {
  const { id } = req.params;

  let response = await detailItem(id);
  return res.status(200).json(response);
};
const getAllItems = async (req, res) => {
  const { id } = req.params;

  let response = await listItem();
  return res.status(200).json(response);
};

const testFunction = () => {
  console.log("Test function");
};

module.exports = {
  getDetailItem,
  getAllItems,
  logAllDb,
};
