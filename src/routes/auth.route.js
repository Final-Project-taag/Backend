
import { Router } from "express";
import loadUser, {registerNewUser,login, verifyEmail, refreshNewVerification, addNewAdmin} from "../controller/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";

// Erstelle neue Router Instanz
const authRouter = Router();

// Routen Definition fuer /register
authRouter.route("/register")
    .post(registerNewUser);

// Routen Definition fuer /login
authRouter.route("/login")
    .post(login);

// Routen Definition fuer /verify (Email-Verifikation)
authRouter.route("/verify")
    .post(verifyEmail)
    .put(refreshNewVerification);

authRouter.route("/auth")
    .get(verifyToken, loadUser);

authRouter.route('/register-admin')
    .post (verifyToken)
export default authRouter;
