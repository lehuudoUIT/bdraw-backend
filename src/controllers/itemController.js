import { detailItem, listItem } from "../services/itemService";

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

module.exports = {
  getDetailItem,
  getAllItems,
};
