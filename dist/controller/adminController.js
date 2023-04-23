"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLogin = exports.AdminRegister = void 0;
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const userModel_1 = require("../model/userModel");
const notification_1 = require("../utils/notification");
/**===================================== REGISTER ADMIN ===================================== **/
const AdminRegister = async (req, res, next) => {
    try {
        const { email, phone, password, firstName, lastName, companyName, photoOfContactPerson, } = req.body;
        const uuidAdmin = (0, uuid_1.v4)();
        const validateResult = utility_1.adminSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
            return;
        }
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)();
        const adminPassword = await (0, utility_1.GeneratePassword)(password, salt);
        //Generate OTP
        const { otp } = (0, notification_1.GenerateOTP)();
        //check if the Admin exists
        const Admin = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (!Admin) {
            await userModel_1.UserInstance.create({
                id: uuidAdmin,
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                phone,
                companyName,
                photoOfContactPerson,
                verified: true,
                role: "admin",
                otp,
            });
            //Re-check if the admin exist
            const Admin = (await userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate a signature for admin
            let signature = await (0, utility_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            return res.status(201).json({
                message: "Admin created successfully",
                signature,
                verified: Admin.verified,
            });
        }
        return res.status(400).json({
            message: "Admin already exist!",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/admin-signup",
        });
    }
};
exports.AdminRegister = AdminRegister;
/**===================================== Login Admin ===================================== **/
const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.loginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        ;
        //check if the Admin exist
        const Admin = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        const validation = await (0, utility_1.validatePassword)(password, Admin.password, Admin.salt);
        if (validation) {
            //Generate signature
            let signature = await (0, utility_1.GenerateSignature)({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });
            return res.status(200).json({
                message: "You have successfully logged in",
                signature,
                email: Admin.email,
                verified: Admin.verified,
                role: Admin.role,
            });
        }
        res.status(400).json({
            Error: "Wrong Username or password",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/admin-login",
        });
    }
};
exports.AdminLogin = AdminLogin;
