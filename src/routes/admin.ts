import express from "express";
import { auth } from "../middleware/authorization";
import { AdminLogin, AdminRegister } from "../controller/adminController";

const router = express.Router();

router.post('/admin-signup', AdminRegister);
router.post('/admin-login', AdminLogin);


export default router;