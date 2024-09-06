import express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT;
const databaseURL = process.env.DATABASE_URL;
app.use(cors)

mongoose.connect(databaseURL).then(()=>{
    console.log("DB connection successful")
}).catch((err)=>console.log(err.message))


const server = app.listen(port,()=>{
    console.log("Server is running at http://localhost:$(port)");
})