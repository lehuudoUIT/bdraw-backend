import db from "../models/index";

const logAll = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let avatars = await db.Avatar.findAll();
      console.log("🚀 ~ logAll ~ avatars:", avatars);
      let joins = await db.Join.findAll();
      console.log("🚀 ~ logAll ~ joins:", joins);

      let player_avatars = await db.Player_Avatar.findAll();
      console.log("🚀 ~ logAll ~ player_avatars:", player_avatars);
      let players = await db.Player.findAll();
      console.log("🚀 ~ logAll ~ players:", players);
      let ranks = await db.Rank.findAll();
      console.log("🚀 ~ logAll ~ ranks:", ranks);

      let tables = [avatars, joins, player_avatars, players, ranks];

      return resolve({
        errCode: 0,
        message: "Log table successfully!",
        tables: tables,
      });
    } catch (error) {
      console.log("🚀 ~ logAll ~ error:", error);
    }
  });
};

const detailItem = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let item = await db.Avatar.findOne({
        where: {
          avatarId: id,
        },
        raw: true,
      }).catch((err) => {
        console.log(err);
      });

      return resolve({
        errCode: 0,
        message: "Get detail item successfully!",
        item: item,
      });
    } catch (error) {
      return reject({
        errCode: 2,
        message: "Get detail item unsuccessfully!",
      });
    }
  });
};
const listItem = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let listItem = await db.Avatar.findAll({ raw: true }).catch((err) => {
        console.log(err);
      });

      return resolve({
        errCode: 0,
        message: "Get list items successfully!",
        listItem: listItem,
      });
    } catch (error) {
      return reject({
        errCode: 2,
        message: "Get list item unsuccessfully!",
      });
    }
  });
};

module.exports = {
  detailItem,
  listItem,
  logAll,
};
