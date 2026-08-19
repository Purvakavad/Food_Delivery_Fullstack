import mongoose from "mongoose";
import bcrypt from "bcry/^\s*\ncpnsppt";
import dotenv from "dotenv";
import adminModel from "../models/adminModel.js";
dotenv.config();
await mongoose.connect(process.env.MONGOOSE_URL);
const adminExists = await adminModel.findOne({
    email: "admin@bitebuddy.com"
});
if (adminExists) {
    process.exit();
}
const hashedPassword = await bcrypt.hash("Admin@123", 10);
await adminModel.create({
    name: "Purva Kavad",
    email: "admin@bitebuddy.com",
    password: hashedPassword
});
console.log("Admin created successfully");
process.exit();