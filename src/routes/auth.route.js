import { Router } from "express";
import { registerNewUser, login, } from "../controller/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import loadUser from "../controller/user.controller.js";

// Erstelle neue Router Instanz
const authRouter = Router();

// Routen Definition fuer /register
authRouter.route('/register')
    .post(registerNewUser);

// Routen Definition fuer /login
authRouter.route('/login')
    .post(login);
authRouter.route('/auth')
.get(verifyToken, loadUser);


export default authRouter;