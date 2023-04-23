"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const config_1 = require("../config");
const userModel_1 = require("../model/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        console.log(authorization);
        if (!authorization) {
            return res.status(401).json({
                Error: "Kindly login"
            });
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                Error: "unauthorised"
            });
        }
        ;
        const { id } = verified;
        // find the user by id
        const user = await userModel_1.UserInstance.findOne({
            where: { id: id },
        });
        if (!user) {
            return res.status(401).json({
                Error: "Invalid Credentials"
            });
        }
        req.user = verified;
        next();
    }
    catch (err) {
        return res.status(401).json({
            Error: "unauthorised"
        });
    }
};
exports.auth = auth;
