import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config";
import adminRouter from "./routes/admin";
import userRouter from "./routes/users"
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json())
app.use(logger("dev"));
app.use(cookieParser());

//this calls the database connection
connectDB();

app.use('/admins', adminRouter)
app.use('/user', userRouter)

const PORT = 3005;
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
});

export default app;