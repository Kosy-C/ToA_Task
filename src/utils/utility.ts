import jwt, {JwtPayload} from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcrypt";
import { APP_SECRET } from "../config";
import { AuthPayLoad } from "../interface";


export const option = {
    abortEarly: false,        
    errors: {
        wrap: {label: ''}
    }
};

export const adminSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    phone: Joi.string().required(),
    firstName:Joi.string().required(),
    lastName:Joi.string().required(), 
    companyName:Joi.string(), 
    photoOfContactPerson:Joi.string(), 
});
export const userSchema = Joi.object().keys({
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    firstName:Joi.string().required(),
    lastName:Joi.string().required(), 
    companyName:Joi.string().required(), 
    photoOfContactPerson:Joi.string(), 
});

export const loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

export const GenerateSalt = async()=>{
    return await bcrypt.genSalt()
};

export const GeneratePassword = async(password: string, salt: string)=>{
    return await bcrypt.hash(password, salt)
};

export const validatePassword = async(enteredPassword:string, savedPassword:string, salt:string)=>{
    return await GeneratePassword(enteredPassword, salt) === savedPassword;
};

export const GenerateSignature = async(payload: AuthPayLoad)=>{
    return jwt.sign(payload, APP_SECRET, {expiresIn: '1d'})  
};

export const verifySignature = async(signature:string)=>{
    return jwt.verify(signature, APP_SECRET) as JwtPayload
};