 
import { Router } from "express";
import { registerNewUser, login,verifyEmail, refreshNewVerification} from "../controller/user.controller.js";

// Erstelle neue Router Instanz
const authRouter = Router();

// Routen Definition fuer /register
authRouter.route('/register')
    .post(registerNewUser);

// Routen Definition fuer /login
authRouter.route('/login')
    .post(login);

    
// Routen Definition fuer /verify (Email-Verifikation)
authRouter.route('/verify')
    .post(verifyEmail)
    .put(refreshNewVerification);

    
export default authRouter;