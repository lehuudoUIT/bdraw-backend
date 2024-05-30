import db from "../models/index";

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
};
