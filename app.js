import express from "express";
import cors from 'cors';
import 'dotenv/config';
import connectDB from "./db/connection.js";
import authRoutes from './routes/auth.js'
import cookieParser from "cookie-parser";
const app=express();

//DB connection
await connectDB();
//middleware
app.use(cors());
// app.use(cors({
//     origin:"http://localhost:5000"
// }));
app.use(express.json());
app.use(cookieParser());
//routes middleware
app.use(authRoutes);


app.listen(process.env.PORT,()=>console.log(`Server Up and Running on port : ${process.env.PORT}`));