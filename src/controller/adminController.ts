import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
    option,
    adminSchema,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    loginSchema,
    validatePassword,
    //verifySignature,
} from "../utils/utility";
import { UserAttributes, UserInstance } from "../model/userModel";  
import { GenerateOTP } from "../utils/notification";


/**===================================== REGISTER ADMIN ===================================== **/

export const AdminRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            email,
            phone,
            password,
            firstName,
            lastName,
            companyName,
            photoOfContactPerson,
        } = req.body;

        const uuidAdmin = uuidv4();

        const validateResult = adminSchema.validate(req.body, option);
        
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
            return;
        }

        //Generate salt
        const salt = await GenerateSalt();
        const adminPassword = await GeneratePassword(password, salt);

        //Generate OTP
        const { otp } = GenerateOTP();

        //check if the Admin exists
        const Admin = await UserInstance.findOne({
            where: { email: email },
        });

        if (!Admin) {
            await UserInstance.create({
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
            const Admin = (await UserInstance.findOne({
                where: { email: email },
            })) as unknown as UserAttributes;

            //Generate a signature for admin
            let signature = await GenerateSignature({
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
    } catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/admin-signup",
        });
    }
};

/**===================================== Login Admin ===================================== **/
export const AdminLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const validateResult = loginSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        };
      
        //check if the Admin exist
        const Admin = await UserInstance.findOne({
            where: { email: email },
        }) as unknown as UserAttributes;
       
        const validation = await validatePassword(
            password,
            Admin.password,
            Admin.salt
        ); 

        if (validation) {
            //Generate signature
            let signature = await GenerateSignature({
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


    } catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/admin-login",
        });
    }
};



