import express from "express";
import { auth } from "../middleware/authorization";
import { RegisterUser, UserLogin, verifyUser } from "../controller/userController";

const router = express.Router();

router.post('/user-signup', auth, RegisterUser);
router.post('/user-verify/:signature', verifyUser);
router.post('/user-login', UserLogin);

export default router;