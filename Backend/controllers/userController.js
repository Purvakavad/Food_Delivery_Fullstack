import userModel from "../models/userModel.js"
import validator from "validator";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { response } from "express";
import orderModel from "../models/orderModel.js";
import adminModel from "../models/adminModel.js";
import foodModel from '../models/foodModel.js'
import multer from '../Midllerware/multer.js'
import cloudinary from '../config/cloudinary.js'
import mongoose from "mongoose";
import notificationModel from "../models/notificationModel.js";

const userLogin = async(req,res)=>{
    try {
        const {email,password} = req.body
        const userExist = await userModel.findOne({email})
        if(!userExist){
            return res.json({success:false,message: "User not found. Please register first."})
        }
        const match = await bcrypt.compare(password,userExist.password);
        if(!match){
            return res.json({success:false,message: "Invalid password"})
        }
        const token = jwt.sign(
            { id: userExist._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({success:true,message:"Login Successfully"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const userRegistetion = async(req,res)=>{
    try {
        const {name,email,password} = req.body
        const normalizedEmail = email.trim().toLowerCase();
    const exist = await userModel.findOne({   email: normalizedEmail});
    if(exist){
        return res.json({success:false,message:"User already exist"})
    }
    if (!validator.isEmail(email)) {
    return res.json({
        success: false,
        message: "Please enter a valid email."
    });
}
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;
        if (!passwordRegex.test(password)) {
                return res.json({
                    success: false,
                    message:
                        "Password must be at least 8 characters and include uppercase, lowercase, number and special character."
                });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const user = new userModel({
            name,
            email:normalizedEmail,
            password:hashedPassword
        })
        await user.save()
        await notificationModel.create({
            type: "new_user",
            title: "New User Registered",
            message: `${user.name} has joined BiteBuddy.`,
            userId: user._id
        });
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
                expiresIn: "7d"
            })
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
return res.json({
    success:true,
    message:"Registration Successfully"
});
    } catch (error) {
        res.json({success:false,message:error.message})
     console.log(error)   
    }
}
const checkAuth = (req,res)=>{
    try {
        return res.json({
            success:true
        }) 
    } catch (error) {
        console.log(error)
    }
}
const getUser =async(req,res)=>{
    try {
        const {userToken} = req.cookies
        if(!userToken){
            return res.status(401).json({success:false,message:"please login is required"})
        }
        const user = await userModel.findById(req.userId).select("-password")
        if(!user){
            return res.status(404).json({success:false,message:"user is not exist"})
        }          
        const totalOrders = await orderModel.countDocuments({userId:req.userId})
        const recentOrders = await orderModel.find({userId:req.userId}).sort({ createdAt: -1 }).limit(3)
        const userData={user,totalOrders,recentOrders}
        res.json({success:true,data:userData})
    } catch (error) {
        console.log(error)
    }
}
const editUserProfile = async(req,res)=>{
    try {
        const {name,phoneno} = req.body  
        const updateData = {name,phoneno}   
        const user = await userModel.findById(req.userId);
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
             if(result.secure_url){
                if(user.imagePublicId){
                    const deleteResult=await cloudinary.uploader.destroy(user.imagePublicId)
                }
             }
              updateData.image = result.secure_url;
    updateData.imagePublicId = result.public_id;
        }  
        await userModel.findByIdAndUpdate(req.userId, updateData);
        res.json({success:true,message:"Profile Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const editUserPassword = async(req,res)=>{
    const {currentPassword,newPassword,confirmPassword}=req.body
    if(!currentPassword|| !newPassword || !confirmPassword){
        return res.json({success:false,message:"All fields are required"})
    }
            const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.json({success:false,message: "Password must contain uppercase, lowercase, number and special character."}
            );
        }
    if(newPassword !== confirmPassword){
        return res.json({success:false,message:"New password and confirm password do not match"})
    }
    const user = await userModel.findById(req.userId)
    if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
    const match = await bcrypt.compare(currentPassword,user.password)
    if(!match){
        return res.json({success:false,message:"Current password is incorrect"})
    }
    const samepwd = await bcrypt.compare(newPassword,user.password)
    if(samepwd){
        return res.json({success:false,message:"New password must be different from current password"})
    }
    const hashedpwd = await bcrypt.hash(newPassword,10)
    user.password=hashedpwd
    await user.save()
    res.clearCookie("userToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });
        return res.status(200).json({
            success: true,
            message: "Password updated successfully. Please login again."
        });
}
const logoutUser = (req, res) => {
    res.clearCookie("userToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
    return res.json({
        success: true,
        message: "Logged out successfully"
    });
};
const adminLogin = async(req,res)=>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.json({success:false,message:"Email and Password are required"})
        }
        const admin = await adminModel.findOne({email})
        if (!admin) {
            return res.json({
                success: false,
                message: "Invalid Email or Password"
            });
        }
        const match = await bcrypt.compare(password,admin.password)
        if (!match) {
            return res.json({
                success: false,
                message: "Invalid Password"
            });
        }
        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        res.cookie("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});
        return res.json({
            success:true,
            message:"Login Successfully"
        })
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const getAdminInfo = async (req, res) => {
    try {

        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user"
            });
        }

        const response = await adminModel.findById(req.admin.id);

        if (!response) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        return res.json({
            success: true,
            data: response
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const editAdminProfile=async(req,res)=>{
    try {
        const {name,email}= req.body
        const updateData={name,email}
        const admin = await adminModel.findById(req.admin.id)
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path)
            if(result.secure_url){
                if(admin.imagePublicId){
                    await cloudinary.uploader.destroy(admin.imagePublicId)
                }
            }
            updateData.image =result.secure_url
            updateData.imagePublicId = result.public_id
        }
        await adminModel.findByIdAndUpdate(req.admin.id,updateData)
        res.json({success:true,message:"Profile updated successfully"})
    } catch (error) {
        console.log(error)
    }
}
const editadminPwd = async(req,res)=>{
    try {
        const {currentPassword,newPassword,confirmPassword} = req.body
        const user = await adminModel.findById(req.admin.id)
        if(!user){
            return res.json({success:false,message:"unauthorized user"})
        }
        if(!newPassword || !confirmPassword || !currentPassword){
            return res.json({success:false,message:"All fields are requiredddd"})
        }
        const match = await bcrypt.compare(currentPassword,user.password)
        if(!match){
            return res.json({success:false,message:"Current Password in incorrect"})
        }
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.json({success:false,message: "Password must contain uppercase, lowercase, number and special character."}
            );
        }
        if(newPassword !== confirmPassword){
            return res.json({success:false,message:"new password and confirm password not match"})
        }
        const samepwd = await bcrypt.compare(newPassword,user.password);
        if(samepwd){
            return res.json({success:false,message:"New password must be different from current password"})
        }
        const hashedPwd = await bcrypt.hash(newPassword,10)
        user.password = hashedPwd
        await user.save()
        res.clearCookie("adminToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });
        res.json({success:true,message:"Password updated"})
    } catch (error) {
        console.log(error)
            return res.json({success:false,message:error.message})
    }
}
const logoutAdmin = (req, res) => {
    res.clearCookie("adminToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
    return res.json({
        success: true,
        message: "Admin logged out successfully"
    });
};
const getFoodInfo = async(req,res)=>{
    try {
        const totalProducts = await foodModel.countDocuments();
        const totalOrders= await orderModel.countDocuments();
        const totalUsers= await userModel.countDocuments();
        const revenue = await orderModel.aggregate([
        {
            $match: {
                payment: true
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$amount"
                }
            }
        }
        ]);
        const recentOrders = await orderModel.find().sort("-createdAt").limit(5)
    const totalRevenue = revenue[0]?.totalRevenue || 0;
        const topSelling = await orderModel.aggregate([
            {
                $match:{payment:true}
            },{
                $unwind:"$items"
            },
            {
                $group:{
                    _id:"$items._id",
                    name: { $first: "$items.name" },
                    image: { $first: "$items.image" },
                    totalSold: { $sum: "$items.quantity" }
                }
            },{
                $sort:{totalSold:-1}
            },{
                $limit:5
            }
        ])
        const now = new Date()
        const startofCurrentMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        )
        const endOfCurrentMonth = new Date(
            now.getFullYear(),
            now.getMonth()+1,
            1
        )
        const currentRevenue = await orderModel.aggregate([
            {
                $match:{payment:true,
                    createdAt:{
                        $gte:startofCurrentMonth,
                        $lt:endOfCurrentMonth
                    }
                }
            },
            {
                $group:{
                    _id:null,
                    revenue:{
                        $sum:"$amount"
                    }
                }
            }
        ])
        const currentMonthRevenue = currentRevenue[0]?.revenue||0
        const startOfPreviousMonth = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            1
        )
        const endOfPreviosMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        )
        const previousMonth = await orderModel.aggregate([
            {
                $match:{
                    payment:true,
                    createdAt:{
                        $gte:startOfPreviousMonth,
                        $lt:endOfPreviosMonth
                    }
                }
            },
            {
                $group:{
                    _id:null,
                    revenue:{
                        $sum:"$amount"
                    }
                }
            }
        ])
        const previousMonthRevenue = previousMonth[0]?.revenue ||0
        let growth=0
        if(previousMonthRevenue>0){
            growth = ((currentMonthRevenue - previousMonthRevenue)/previousMonthRevenue)*100
        }
        const data ={totalProducts,totalOrders,totalUsers,totalRevenue,recentOrders,topSelling,currentMonthRevenue,previousMonthRevenue,growth: Number(growth.toFixed(1))}
        res.json({success:true,data})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const getAllUsers = async(req,res)=>{
    try {
        const user = await userModel.aggregate([
            {
                $lookup:{
                    from:"orders",
                    localField:"_id",
                    foreignField:"userId",
                    as:"orders"
                }
            },
            {
                $addFields:{
                    totalOrders:{
                        $size:"$orders"
                    }
                }
            },
            {
                $project:{
                    name:1,email:1,totalOrders:1,createdAt:1
                }
            }
        ])
         const orderedCustomer =await orderModel.distinct("userId", {createdAt: {$gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
});
    const orderedUsers = orderedCustomer.length
    const users={user,orderedUsers}
        res.json({success:true,users})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const getSingleUser = async(req,res)=>{
    try {
        const {id} = req.params
        const orders = await orderModel.find({userId:id}).sort("-createdAt").limit(5).populate({ path: "userId", select: "-password -__v"
  });
        const totalSpent = orders.reduce((total,order)=>{
            return total+=order.amount
        },1)
        res.json({success:true,user:{orders,totalSpent}})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const deleteUser = async(req,res)=>{
    try {
        const response = await userModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"user deleted"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel
            .find()
            .sort({ createdAt: -1 })
            .limit(20);
        const unreadCount = await notificationModel.countDocuments({
            isRead: false
        });
        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};
const adminSearch = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || !query.trim()) {
            return res.json({
                success: true,
                products: [],
                users: [],
                orders: []
            });
        }
        const search = query.trim();
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchRegex = new RegExp(escapedSearch, "i");
        const products = await foodModel.find({
            $or: [
                { name: searchRegex },
                { description: searchRegex }
            ]
        })
            .select("name image price offer_price stock status")
            .limit(5);
        const users = await userModel.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex }
            ]
        })
            .select("name email image")
            .limit(5);
        let orders = [];
        if (mongoose.Types.ObjectId.isValid(search)) {
            orders = await orderModel.find({
                _id: search
            })
                .populate("userId", "name email")
                .limit(5);
        } else {
            const matchingUsers = await userModel.find({
                $or: [
                    { name: searchRegex },
                    { email: searchRegex }
                ]
            })
                .select("_id");
            const userIds = matchingUsers.map(user => user._id);
            orders = await orderModel.find({
                $or: [
                    { userId: { $in: userIds } },
                    { status: searchRegex }
                ]
            })
                .populate("userId", "name email")
                .limit(5);
        }
        res.json({
            success: true,
            products,
            users,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            products: [],
            users: [],
            orders: []
        });
    }
};
export{
    userLogin,userRegistetion,adminLogin,checkAuth,getUser,editUserPassword,editUserProfile
,logoutUser,getAdminInfo,getFoodInfo,editadminPwd,editAdminProfile,logoutAdmin,getAllUsers,getSingleUser,deleteUser,getNotifications,adminSearch}