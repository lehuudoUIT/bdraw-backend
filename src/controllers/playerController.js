import {
  handleUserLogin,
  handlePlayerRegister,
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

module.exports = {
  handleLogin,
  handleRegister,
};
