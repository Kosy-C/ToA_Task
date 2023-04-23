"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogin = exports.verifyUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const userModel_1 = require("../model/userModel");
const config_1 = require("../config");
const notification_1 = require("../utils/notification");
/**===================================== Register User ===================================== **/
const RegisterUser = async (req, res) => {
    try {
        const id = req.user.id;
        const { email, phone, password, firstName, lastName, companyName, photoOfContactPerson, } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utility_1.userSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)();
        const userPassword = await (0, utility_1.GeneratePassword)(password, salt);
        //Generate OTP
        const { otp } = (0, notification_1.GenerateOTP)();
        //check if the User exists
        let User = (await userModel_1.UserInstance.findOne({ where: { email: email } }));
        const Admin = (await userModel_1.UserInstance.findOne({ where: { id: id } }));
        if (Admin.role === "admin") {
            if (!User) {
                const newUser = await userModel_1.UserInstance.create({
                    id: uuiduser,
                    firstName,
                    lastName,
                    password: userPassword,
                    email,
                    phone,
                    role: "user",
                    photoOfContactPerson,
                    companyName,
                    salt,
                    verified: false,
                    otp,
                });
                //Generate a signature for user
                let signature = await (0, utility_1.GenerateSignature)({
                    id: newUser.id,
                    email: newUser.email,
                    verified: newUser.verified,
                });
                //send Email to user
                const html = (0, notification_1.emailHtml)(otp);
                await (0, notification_1.mailSent)(config_1.FromAdminMail, email, config_1.userSubject, html);
                //Re-check if user exist
                const User = (await userModel_1.UserInstance.findOne({ where: { email: email }, }));
                return res.status(201).json({
                    message: "User created successfully",
                    signature,
                    verified: User.verified
                });
            }
            return res.status(400).json({
                message: "User already exist",
            });
        }
        ;
        return res.status(400).json({
            message: "unauthorised",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: `Internal server Error ${err}`,
            route: "/user/user-signup",
        });
    }
};
exports.RegisterUser = RegisterUser;
/**===================================== Verify Users ===================================== **/
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utility_1.verifySignature)(token);
        //check if the user is a registered user
        const User = await userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        });
        if (User) {
            const { otp } = req.body;
            if (User.otp === (otp)) {
                const updatedUser = await userModel_1.UserInstance.update({
                    verified: true,
                }, { where: { email: decode.email } });
                //Regenerate a new signature
                let signature = await (0, utility_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                if (updatedUser) {
                    const User = (await userModel_1.UserInstance.findOne({
                        where: { email: decode.email },
                    }));
                    return res.status(200).json({
                        message: "Your account has been verified successfully",
                        signature,
                        verified: User.verified,
                    });
                }
            }
            return res.status(400).json({
                Error: "Invalid credentials",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: `Internal server Error ${err}`,
            route: "/user/user-verify",
        });
    }
};
exports.verifyUser = verifyUser;
/**===================================== Login Users ===================================== **/
const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.loginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        ;
        //check if the User exist
        const User = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        console.log("buggg", User);
        const validation = await (0, utility_1.validatePassword)(password, User.password, User.salt);
        if (validation) {
            //Generate signature
            let signature = await (0, utility_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            return res.status(200).json({
                message: "You have successfully logged in",
                signature,
                email: User.email,
                verified: User.verified,
                role: User.role,
            });
        }
        res.status(400).json({
            Error: "Wrong Username or password",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/user/user-login",
        });
    }
};
exports.UserLogin = UserLogin;
