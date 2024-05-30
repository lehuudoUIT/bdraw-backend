import { Router } from "express";
import { handleLogin, handleRegister } from "../controllers/playerController";
import { getDetailItem, getAllItems } from "../controllers/itemController";
let router = Router();

let initApiRoutes = (app) => {
  //! Authentication
  router.post("/login", handleLogin);
  router.post("/register", handleRegister);
  //! PLAYER
  router.get("/player/history/:id");
  router.get("/match/detail/:id");
  router.get("/player/detail/:id");
  router.get("/player/inventory");
  router.post("/player/use-item");
  router.post("/player/buy-item");

  //! ITEM
  router.get("/item/detail/:id", getDetailItem);
  router.get("/items", getAllItems);
  //! MATCH

  return app.use("/api/v1/", router);
};

module.exports = initApiRoutes;
