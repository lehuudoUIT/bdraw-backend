import db from "../models/index";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();
const nodemailer = require("nodemailer");

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
            //? Get url of rank by rankId
            let rankInfo = await db.Rank.findOne({
              where: {
                rankId: user.rankId,
              },
              attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            console.log(rankInfo);

            delete user.rankId;

            user.rank = rankInfo;

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

const handlePlayerRegister = (name, username, password, gmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = bcrypt.hashSync(password, salt);

      let defaultAvatarUrl = await db.Avatar.findOne({
        where: {
          type: "Default",
        },
      })
        .then((ava) => ava.url)
        .catch((err) => console.log(err));

      let player = await db.Player.create({
        name: name,
        username: username,
        password: hashPassword,
        bcoin: 1000,
        rankId: 0,
        currentAvatar: defaultAvatarUrl,
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
        order: [["createdAt", "DESC"]],
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

let calculateLevel = (exp) => {
  // Calculate level
  let level = Math.floor(Math.sqrt(exp / 100));
  // Calculate range

  let maxExpOfLevel = 100 * ((level + 1) * (level + 1) - level * level);

  // Calculate current exp of level

  let currentExp = exp - 100 * level * level;

  return {
    level,
    maxExpOfLevel,
    currentExp,
  };
};

const playerDetail = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let player = await db.Player.findOne({
        where: {
          playerId: id,
        },
      })
        .then(async (player) => {
          //? Get url of rank by rankId
          let rankInfo = await db.Rank.findOne({
            where: {
              rankId: player.rankId,
            },
            attributes: { exclude: ["createdAt", "updatedAt"] },
          });

          console.log(rankInfo);

          delete player.rankId;

          player.rank = rankInfo;

          //? Calculate level of player

          let level = calculateLevel(player.exp);

          player.exp = level;

          return player;
        })
        .catch((err) => {
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

const playerDetailByUsername = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let player = await db.Player.findOne({
        where: {
          username: username,
        },
      })
        .then(async (player) => {
          //? Get url of rank by rankId
          let rankInfo = await db.Rank.findOne({
            where: {
              rankId: player.rankId,
            },
            attributes: { exclude: ["createdAt", "updatedAt"] },
          });

          console.log(rankInfo);

          delete player.rankId;

          player.rank = rankInfo;

          //? Calculate level of player

          let level = calculateLevel(player.exp);

          player.exp = level;

          return player;
        })
        .catch((err) => {
          console.log(err);
        });

      return resolve({
        errCode: 0,
        message: `Get player ${username} detail successfully!`,
        player,
      });
    } catch (error) {
      reject({
        errCode: 3,
        message: `Get player ${username} detail unsuccessfully!`,
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
const playerUseItem = (playerId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let player = await db.Player.findOne({
        where: {
          playerId: playerId,
        },
      }).catch((err) => {
        console.log(err);
      });

      let avatarUrl = await db.Avatar.findOne({
        where: {
          avatarId: itemId,
        },
      })
        .then((avatar) => {
          return avatar.url;
        })
        .catch((err) => {
          console.log(err);
        });

      await db.Player.update(
        {
          currentAvatar: avatarUrl,
        },
        {
          where: {
            playerId: playerId,
          },
        }
      ).catch((err) => {
        console.log(err);
      });

      return resolve({
        errCode: 0,
        message: `Use avatar ${itemId} successfully!`,
      });
    } catch (error) {
      console.log(error);
      return reject({
        errCode: 0,
        message: `Use avatar unsuccessfully!`,
      });
    }
  });
};
const playerBuyItem = (playerId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let playerBcoin = await db.Player.findOne({
        where: {
          playerId: playerId,
        },
        raw: true,
      })
        .then((player) => player.bcoin)
        .catch((err) => console.log(err));

      let itemPrice = await db.Avatar.findOne({
        where: {
          avatarId: itemId,
        },
      }).then((item) => item.price);

      //? Check if player has enough money
      if (playerBcoin < itemPrice)
        return resolve({
          errCode: 2,
          message: `Player doesn't have enough money!`,
        });

      //? Subtract player money
      await db.Player.decrement(
        {
          bcoin: itemPrice,
        },
        {
          where: {
            playerId: playerId,
          },
        }
      );

      //? Save transaction to database

      await db.Player_Avatar.create({
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
      console.log(error);
      return resolve({
        errCode: 3,
        message: `Player ${playerId} buys avatar ${itemId} unsuccessfully!`,
        error: error,
      });
    }
  });
};
const playerSaveResult = (listPlayer) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.sequelize.transaction(async (t) => {
        let matchId = uuidv4();
        listPlayer.map((player) => {
          player.matchId = matchId;
        });

        // update
        for (const player of listPlayer) {
          // Update player's result

          await db.Player.increment(
            {
              // Assuming you want to update these fields
              bcoin: player.gainedBcoin,
              exp: player.gainedExp,
              score: player.gainedScore,
            },
            {
              where: { playerId: player.playerId },
            }
          );
        }
        // save record
        await db.Join.bulkCreate(listPlayer);
      });
      return resolve({
        errCode: 0,
        message: `Save player result successfully !`,
      });
    } catch (error) {
      console.log(error);
      return resolve({
        errCode: 2,
        message: `Save player result unsuccessfully !`,
        error: error,
      });
    }
  });
};

const matchDetail = (matchId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let matchResult = await db.Join.findAll({
        where: {
          matchId: matchId,
        },
        order: [["top", "ASC"]],
      });

      return resolve({
        errCode: 0,
        message: `Get match ${matchId} result successfully !`,
        matchResult: matchResult,
      });
    } catch {
      console.log(error);
      return resolve({
        errCode: 2,
        message: `Save player result unsuccessfully !`,
        error: error,
      });
    }
  });
};

let checkRank = (score) => {
  if (score < 500) return 0;
  if (score >= 500 && score < 1000) return 1;
  if (score >= 1000 && score < 2000) return 2;
  if (score >= 2000 && score < 4000) return 3;
  if (score >= 4000 && score < 8000) return 4;
  if (score >= 8000 && score < 15000) return 5;
  if (score >= 15000 && score < 30000) return 6;
  if (score >= 30000 && score < 40000) return 7;
  if (score >= 40000 && score < 100000) return 8;
  if (score >= 100000) return 9;
};

let getRankColor = (rankId) => {
  switch (rankId) {
    case 1:
      return "#4A4948";
    case 2:
      return "#B87B57";
    case 3:
      return "#9A9993";
    case 4:
      return "#DDAC42";
    case 5:
      return "#50A9C7";
    case 6:
      return "#127694";
    case 7:
      return "#B93DFD";
    case 8:
      return "#8E1415";
    case 9:
      return "#183867";
    default:
      return "#DAD4CA";
  }
};

const checkUpRank = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let latestMatchScore = await db.Join.findOne({
        where: {
          playerId: id,
        },
        order: [["createdAt", "DESC"]],
      }).then((match) => {
        if (!match) return 0;
        return match.gainedScore;
      });

      let currentScore = await db.Player.findOne({
        where: {
          playerId: id,
        },
      }).then((player) => player.score);

      let checkBeforeScore = checkRank(currentScore - latestMatchScore);
      let checkCurrentScore = checkRank(currentScore);

      let newRank = await db.Rank.findOne({
        where: {
          rankId: checkCurrentScore,
        },
      });

      let color = getRankColor(checkCurrentScore);

      newRank.color = color;

      if (checkBeforeScore < checkCurrentScore) {
        return resolve({
          errCode: 0,
          message: `Check rank successfully !`,
          checkRank: {
            status: "up",
            newRank: newRank,
          },
        });
      } else if (checkBeforeScore > checkCurrentScore) {
        return resolve({
          errCode: 0,
          message: `Check rank successfully !`,
          checkRank: {
            status: "down",
            newRank: newRank,
          },
        });
      } else {
        return resolve({
          errCode: 0,
          message: `Check rank successfully !`,
          checkRank: {
            status: "stable",
            newRank: newRank,
          },
        });
      }
    } catch (error) {
      console.log(error);
      return resolve({
        errCode: 2,
        message: `Check rank player unsuccessfully !`,
        error: error,
      });
    }
  });
};

const sendOTP = async (otp, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASWORD,
        },
      });

      const info = await transporter
        .sendMail({
          from: '"BDraw Admin👻" <lehuudouit@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "OTP verification", // Subject line
          text: "Your OTP is...", // plain text body
          html: `Your OTP is <b>${otp}</b>`, // html body
        })
        .then((info) => {
          resolve({
            errMessage: 0,
            message: "Send OTP sucessfully!",
          });
        })
        .catch((err) => {
          console.log(err);
          resolve({
            errMessage: 1,
            message: "Send OTP failed!",
            err: err,
          });
        });
    } catch (error) {
      reject({
        errMessage: 1,
        message: "Send OTP failed!",
        err: error,
      });
    }
  });
};

const forgetPassword = async (playerId, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newHashPassword = bcrypt.hashSync(newPassword, salt);

      await db.Player.update(
        {
          password: newHashPassword,
        },
        {
          where: {
            playerId: playerId,
          },
        }
      ).catch((err) => {
        console.log(err);
        return resolve({
          errMessage: 3,
          message: "Change password unsucessfully!",
        });
      });
      resolve({
        errMessage: 0,
        message: "Change password sucessfully!",
      });
    } catch (error) {
      console.log(error);
      reject({
        errMessage: 2,
        message: "Change password failed!",
        err: error,
      });
    }
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
  matchDetail,
  checkUpRank,
  playerDetailByUsername,
  sendOTP,
  forgetPassword,
};
