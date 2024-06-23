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
  getMatchDetail,
  getCheckUpRank,
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
  router.get("/match/detail/:id", getMatchDetail);
  router.get("/check/up-rank/:id", getCheckUpRank);

  //! ITEM
  router.get("/item/get-all/:id", getAllItems);
  router.get("/item/detail/:id", getDetailItem);

  //! DEBUG
  router.get("/log-all", logAllDb);
  router.get("/log-test", testFunction);

  return app.use("/api/v1/", router);
};

module.exports = initApiRoutes;
