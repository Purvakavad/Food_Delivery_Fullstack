import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import connectDB from './config/db.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
const app = express()
import itemsRoutes from './routes/itemsRoute.js'
import cloudinary from "./config/cloudinary.js";
import categoryRoute from './routes/categoryRoute.js';
import userRoute from './routes/userRoutes.js';
import cartRoute from './routes/cartRoutes.js';
import orderRoute from './routes/orderRoutes.js';
import paymentRouter from './routes/paymentRoute.js';
const allowedOrigins = [
    "http://localhost:4173",
    "http://localhost:5173",
    "http://localhost:5174",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
connectDB()
app.use("/api/user",userRoute)
app.use("/api/food",itemsRoutes)
app.use('/api/category',categoryRoute)
app.use('/api/cart',cartRoute)
app.use('/api/order',orderRoute)
app.use('/api/coupon',cartRoute)
app.use("/api/payment", paymentRouter);
app.listen(4000,()=>{
    console.log("server run on port 4000")
})