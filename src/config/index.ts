import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// export const db = new Sequelize("postgres", "postgres", "password", {
//     host: "127.0.0.1",
//     port: 5432,
//     dialect: "postgres",
//     logging: false
// });

export const db = new Sequelize( process.env.DATABASE_NAME as string, process.env.DATABASE_USERNAME as string, process.env.DATABASE_PASSWORD, {
      host: process.env.DATABASE_HOST,
      port: 5432,
      dialect: "postgres",
      logging: false,
      dialectOptions: {encrypt: true, ssl:{rejectUnauthorized: false}},
    } 
  );

export const connectDB = async()=>{
    try {
        await db.authenticate();
        await db.sync();
        console.log("Connection established successfully")
    } catch(error) {
        console.log("Unable to connect to database:", error);
    }
};

export const APP_SECRET = process.env.APP_SECRET as string;
export const BASE_URL = process.env.Base_URL;
export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_PASS = process.env.GMAIL_PASS;
export const FromAdminMail = process.env.FromAdminMail as string;
export const userSubject = process.env.usersubject as string;
