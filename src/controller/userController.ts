import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
    option,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    userSchema,
    loginSchema,
    validatePassword,
    verifySignature,
    //verifySignature,
} from "../utils/utility";
import { UserAttributes, UserInstance } from "../model/userModel";
import { FromAdminMail, userSubject } from "../config";
import { emailHtml, GenerateOTP, mailSent } from "../utils/notification";


/**===================================== Register User ===================================== **/
export const RegisterUser = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.user.id;
        const {
            email,
            phone,
            password,
            firstName,
            lastName,
            companyName,
            photoOfContactPerson,
        } = req.body;
        const uuiduser = uuidv4();

        const validateResult = userSchema.validate(req.body, option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Generate salt
        const salt = await GenerateSalt();
        const userPassword = await GeneratePassword(password, salt);

        //Generate OTP
        const { otp } = GenerateOTP();

        //check if the User exists
        let User = (await UserInstance.findOne({ where: { email: email } })) as unknown as UserAttributes;

        const Admin = (await UserInstance.findOne({ where: { id: id } })) as unknown as UserAttributes;

        if (Admin.role === "admin") {
            if (!User) {
                const newUser = await UserInstance.create({
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
                }) as unknown as UserAttributes;

                //Generate a signature for user
                let signature = await GenerateSignature({
                    id: newUser.id,
                    email: newUser.email,
                    verified: newUser.verified,
                });

                //send Email to user
                const html = emailHtml(otp);
                await mailSent(
                    FromAdminMail,
                    email,
                    userSubject,
                    html
                );

                //Re-check if user exist
                const User = (await UserInstance.findOne({ where: { email: email }, })) as unknown as UserAttributes;

                return res.status(201).json({
                    message: "User created successfully",
                    signature,
                    verified: User.verified
                });
            }
            return res.status(400).json({
                message: "User already exist",
            });

        };

        return res.status(400).json({
            message: "unauthorised",
        });
    } catch (err) {
        res.status(500).json({
            Error: `Internal server Error ${err}`,
            route: "/user/user-signup",
        });
    }
};

/**===================================== Verify Users ===================================== **/
export const verifyUser = async (req: Request, res: Response) => {
    try {
        
      const token = req.params.signature;
      const decode = await verifySignature(token);
        
      //check if the user is a registered user
      const User = await UserInstance.findOne({
        where: { email: decode.email },
      }) as unknown as UserAttributes;
  
      if (User) {
        const { otp } = req.body;
        if (User.otp === (otp) ) {
          const updatedUser = await UserInstance.update({
              verified: true,
            },
            { where: { email: decode.email } }
          ) as unknown as UserAttributes;
  
          //Regenerate a new signature
          let signature = await GenerateSignature({
            id: updatedUser.id,
            email: updatedUser.email,
            verified: updatedUser.verified,
          });
  
          if (updatedUser) {
            const User = (await UserInstance.findOne({
              where: { email: decode.email },
            })) as unknown as UserAttributes;
  
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
  
      
    } catch (err) {
      res.status(500).json({
        Error: `Internal server Error ${err}`,
        route: "/user/user-verify",
      });
    }
  };

/**===================================== Login Users ===================================== **/
export const UserLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        const validateResult = loginSchema.validate(req.body, option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        };
      
        //check if the User exist
        const User = await UserInstance.findOne({
            where: { email: email },
        }) as unknown as UserAttributes;
        console.log("buggg", User)
        const validation = await validatePassword(
            password,
            User.password,
            User.salt
        ); 

        if (validation) {
            //Generate signature
            let signature = await GenerateSignature({
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


    } catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/user/user-login",
        });
    }
};



