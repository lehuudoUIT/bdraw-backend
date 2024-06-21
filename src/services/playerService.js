import db from "../models/index";
import bcrypt from "bcryptjs";

let salt = bcrypt.genSaltSync(10);

let checkUsername = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.Player.findOne({
        where: { username: username },
      }).catch((err) => {
        console.log(err);
      });
      if (user) {
        resolve(user);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let handleUserLogin = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isExisted = await checkUsername(username);
      if (isExisted) {
        // User already exists
        let user = await db.Player.findOne({
          where: { username: username },
          raw: true,
        }).catch((err) => {
          console.log(err);
        });
        if (user) {
          let checkPassword = bcrypt.compareSync(password, user.password);

          delete user.password;

          if (checkPassword) {
            return resolve({
              errCode: 0,
              message: "Login successfully!",
              user: user,
            });
          } else {
            return resolve({
              errCode: 2,
              message: "Wrong password!",
            });
          }
        }
      } else {
        return resolve({
          errCode: 2,
          message:
            "Your username isn's exists in our system. Please try again!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const handlePlayerRegister = (username, password, gmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = bcrypt.hashSync(password, salt);

      let player = await db.Player.create({
        username: username,
        password: hashPassword,
        bcoin: 0,
        rankId: 0,
        currentAvatar: "",
        exp: 0,
        score: 0,
        gmail: gmail,
      })
        .then((result) => {
          return result.get({ plain: true });
        })
        .catch((err) => {
          return resolve({
            errCode: 2,
            message: "Create player unsuccessfully!",
            error: err.errors[0].message,
          });
        });

      return resolve({
        errCode: 0,
        message: "Create player successfully!",
        player: player,
      });
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error);

      reject({
        errCode: 3,
        message: "Create player unsuccessfully!",
        error: error,
      });
    }
  });
};

const playerHistory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let history = await db.Join.findAll({
        where: {
          playerId: id,
        },
      }).catch((err) => {
        console.log(err);
      });
      return resolve({
        errCode: 0,
        message: `Get player ${id} history successfully!`,
        history: history,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: `Get player ${id} history unsuccessfully!`,
        error: error,
      });
    }
  });
};

const playerDetail = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let player = await db.Player.findOne({
        where: {
          playerId: id,
        },
      }).catch((err) => {
        console.log(err);
      });

      return resolve({
        errCode: 0,
        message: `Get player ${id} detail successfully!`,
        player,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: `Get player ${id} detail unsuccessfully!`,
        error: error,
      });
    }
  });
};
const playerInventory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      //? Get list avatar id
      let avatarIds = await db.Player_Avatar.findAll({
        where: {
          playerId: id,
        },
      })
        .then((avatars) => {
          return avatars.map((avatar) => avatar.avatarId);
        })
        .catch((err) => {
          console.log(err);
        });

      //? Get detail avatar
      let listAvatar = [];

      for (let avatarId of avatarIds) {
        let avatar = await db.Avatar.findOne({
          where: {
            avatarId: avatarId,
          },
        });

        listAvatar = listAvatar.concat(avatar);
      }

      return resolve({
        errCode: 0,
        message: `Get player ${id} inventory successfully!`,
        listAvatar,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: `Get player ${id} inventory unsuccessfully!`,
        error: error,
      });
    }
  });
};
const playerUseItem = () => {
  return new Promise(async (resolve, reject) => {
    try {
    } catch (error) {}
  });
};
const playerBuyItem = (playerId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      db.Player_Avatar.create({
        playerId,
        avatarId: itemId,
      }).catch((err) => {
        console.log(err);
        return resolve({
          errCode: 2,
          message: `Player ${playerId} buys avatar ${itemId} unsuccessfully!`,
          error: err,
        });
      });

      return resolve({
        errCode: 0,
        message: `Player ${playerId} buys avatar ${itemId} successfully!`,
      });
    } catch (error) {
      return resolve({
        errCode: 3,
        message: `Player ${playerId} buys avatar ${itemId} unsuccessfully!`,
        error: error,
      });
    }
  });
};
const playerSaveResult = () => {
  return new Promise(async (resolve, reject) => {
    try {
    } catch (error) {}
  });
};
module.exports = {
  handleUserLogin,
  handlePlayerRegister,
  playerHistory,
  playerSaveResult,
  playerDetail,
  playerInventory,
  playerUseItem,
  playerBuyItem,
};
