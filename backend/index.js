import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import userRoute from "./routers/user.router.js"

dotenv.config()

const app = express();

let port = process.env.PORT || 3000;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

app.use(cors(corsOptions))

// API's

app.use("/api/v1/user", userRoute);


app.listen(port, () => {
    connectDB();
    console.log(`Listening port ${port}`);
})