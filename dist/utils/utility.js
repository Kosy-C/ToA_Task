"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.GenerateSignature = exports.validatePassword = exports.GeneratePassword = exports.GenerateSalt = exports.loginSchema = exports.userSchema = exports.adminSchema = exports.option = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
exports.option = {
    abortEarly: false,
    errors: {
        wrap: { label: '' }
    }
};
exports.adminSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    phone: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    companyName: joi_1.default.string(),
    photoOfContactPerson: joi_1.default.string(),
});
exports.userSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    companyName: joi_1.default.string().required(),
    photoOfContactPerson: joi_1.default.string(),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});
const GenerateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return await (0, exports.GeneratePassword)(enteredPassword, salt) === savedPassword;
};
exports.validatePassword = validatePassword;
const GenerateSignature = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: '1d' });
};
exports.GenerateSignature = GenerateSignature;
const verifySignature = async (signature) => {
    return jsonwebtoken_1.default.verify(signature, config_1.APP_SECRET);
};
exports.verifySignature = verifySignature;
