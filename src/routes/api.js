import { Router } from "express";
import {
  handleLogin,
  handleRegister,
  getPlayerHistory,
  postPlayerSaveResult,
  getPlayerDetail,
  getPlayerInventory,
  postPlayerUseItem,
  postPlayerBuyItem,
} from "../controllers/playerController";
import {
  getDetailItem,
  getAllItems,
  logAllDb,
  testFunction,
} from "../controllers/itemController";
let router = Router();

let initApiRoutes = (app) => {
  //! Authentication
  router.post("/login", handleLogin);
  router.post("/register", handleRegister);
  //! PLAYER
  router.get("/player/history/:id", getPlayerHistory);
  router.get("/player/detail/:id", getPlayerDetail);
  router.get("/player/inventory/:id", getPlayerInventory);
  router.post("/player/use-item", postPlayerUseItem);
  router.post("/player/buy-item", postPlayerBuyItem);
  router.post("/player/save-result", postPlayerSaveResult);

  //! ITEM
  router.get("/item/get-all", getAllItems);
  router.get("/item/detail/:id", getDetailItem);
  //! MATCH
  router.get("/match/detail/:id");
  router.post("/match/create");
  router.post("/match/result");

  //! DEBUG
  router.get("/log-all", logAllDb);
  router.get("/log-test", testFunction);

  return app.use("/api/v1/", router);
};

module.exports = initApiRoutes;
