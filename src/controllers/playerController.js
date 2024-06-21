import {
  handleUserLogin,
  handlePlayerRegister,
  playerHistory,
  playerSaveResult,
  playerDetail,
  playerInventory,
  playerUseItem,
  playerBuyItem,
} from "../services/playerService";

let handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await handleUserLogin(username, password);
  return res.status(200).json(response);
};

const handleRegister = async (req, res) => {
  const { username, password, gmail } = req.body;
  if (!username || !password || !gmail) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await handlePlayerRegister(username, password, gmail);
  return res.status(200).json(response);
};

const getPlayerHistory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await playerHistory(id);
  return res.status(200).json(response);
};
const getPlayerDetail = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await playerDetail(id);
  return res.status(200).json(response);
};
const getPlayerInventory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await playerInventory(id);
  return res.status(200).json(response);
};
const postPlayerUseItem = async (req, res) => {
  const { playerId, itemId } = req.body;

  if (!playerId || !itemId) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await playerUseItem(playerId, itemId);
  return res.status(200).json(response);
};
const postPlayerBuyItem = async (req, res) => {
  const { playerId, itemId } = req.body;
  if (!playerId || !itemId) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await playerBuyItem(playerId, itemId);
  return res.status(200).json(response);
};
const postPlayerSaveResult = async (req, res) => {};

module.exports = {
  handleLogin,
  handleRegister,
  getPlayerHistory,
  postPlayerSaveResult,
  getPlayerDetail,
  getPlayerInventory,
  postPlayerUseItem,
  postPlayerBuyItem,
};
