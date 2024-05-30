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

module.exports = {
  handleUserLogin,
  handlePlayerRegister,
};
