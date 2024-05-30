import { Router } from "express";
import { handleLogin, handleRegister } from "../controllers/playerController";
let router = Router();

let initApiRoutes = (app) => {
  // example login
  router.post("/login", handleLogin);
  router.post("/register", handleRegister);

  return app.use("/api/v1/", router);
};

module.exports = initApiRoutes;
