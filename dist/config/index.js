"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSubject = exports.FromAdminMail = exports.GMAIL_PASS = exports.GMAIL_USER = exports.BASE_URL = exports.APP_SECRET = exports.connectDB = exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// export const db = new Sequelize("postgres", "postgres", "password", {
//     host: "127.0.0.1",
//     port: 5432,
//     dialect: "postgres",
//     logging: false
// });
exports.db = new sequelize_1.Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    port: 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: { encrypt: true, ssl: { rejectUnauthorized: false } },
});
const connectDB = async () => {
    try {
        await exports.db.authenticate();
        await exports.db.sync();
        console.log("Connection established successfully");
    }
    catch (error) {
        console.log("Unable to connect to database:", error);
    }
};
exports.connectDB = connectDB;
exports.APP_SECRET = process.env.APP_SECRET;
exports.BASE_URL = process.env.Base_URL;
exports.GMAIL_USER = process.env.GMAIL_USER;
exports.GMAIL_PASS = process.env.GMAIL_PASS;
exports.FromAdminMail = process.env.FromAdminMail;
exports.userSubject = process.env.usersubject;
