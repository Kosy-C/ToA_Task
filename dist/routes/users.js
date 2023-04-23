"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middleware/authorization");
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.post('/user-signup', authorization_1.auth, userController_1.RegisterUser);
router.post('/user-verify/:signature', userController_1.verifyUser);
router.post('/user-login', userController_1.UserLogin);
exports.default = router;
