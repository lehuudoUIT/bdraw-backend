import {
  handleUserLogin,
  handlePlayerRegister,
  playerHistory,
  playerSaveResult,
  playerDetail,
  playerInventory,
  playerUseItem,
  playerBuyItem,
  matchDetail,
  checkUpRank,
  playerDetailByUsername,
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
  const { name, username, password, gmail } = req.body;
  if (!name || !username || !password || !gmail) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await handlePlayerRegister(name, username, password, gmail);
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

const getPlayerDetailByUsername = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await playerDetailByUsername(username);
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
const postPlayerSaveResult = async (req, res) => {
  const { listPlayer } = req.body;
  if (!listPlayer) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await playerSaveResult(listPlayer);
  return res.status(200).json(response);
};

const getMatchDetail = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await matchDetail(id);
  return res.status(200).json(response);
};

const getCheckUpRank = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter !",
    });
  }
  let response = await checkUpRank(id);
  return res.status(200).json(response);
};

module.exports = {
  handleLogin,
  handleRegister,
  getPlayerHistory,
  postPlayerSaveResult,
  getPlayerDetail,
  getPlayerInventory,
  postPlayerUseItem,
  postPlayerBuyItem,
  getMatchDetail,
  getCheckUpRank,
  getPlayerDetailByUsername,
};
