import express  from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import ContactRoute from "./routes/ContactsRoute.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import channelRoute from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
const databaseURL = process.env.DATABASE_URL;
app.use(cors({
    origin:['https://live-chat-syncronous.vercel.app',
        'http://localhost:5173'],
    methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    credentials:true
}))

app.use("/uploads/profile",express.static("/tmp/uploads/profile"))
app.use("/uploads/files",express.static("/tmp/uploads/files"))
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/contacts",ContactRoute)
app.use("/api/messages",messagesRoutes)
app.use("/api/channel",channelRoute)

const server = app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})

setupSocket(server);

mongoose.connect(databaseURL).then(()=>{
    console.log("DB connection successful")
}).catch((err)=>console.log(err.message))


