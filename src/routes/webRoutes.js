import { Router } from "express";
import userControler from '../controllers/userController'
let router = Router();

let initWebRoutes = (app) => {
    // example login
    router.post("/api/login", userControler.handleLogin);

    return app.use("/", router);
}

module.exports = initWebRoutes;