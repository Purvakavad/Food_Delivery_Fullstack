import userModel from '../models/userModel.js'
import foodModel from '../models/foodModel.js'
import orderModel from '../models/orderModel.js'
import Razorpay from "razorpay";
import notificationModel from "../models/notificationModel.js";
import crypto from "crypto";
import categoryModel from '../models/categoryModel.js';
const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_ID,
    key_secret:process.env.RAZORPAY_SECRET
})
const placeOrder = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }
        const { address, items, amount } = req.body;
        for (const item of items) {
            const food = await foodModel.findById(item._id);
            if (!food) {
                return res.json({
                    success: false,
                    message: "Food not found"
                });
            }
            if (food.stock <= 0) {
                return res.json({
                    success: false,
                    message: `${food.name} is out of stock`
                });
            }
            if (food.stock < item.quantity) {
                return res.json({
                    success: false,
                    message: `${food.name} has only ${food.stock} items available`
                });
            }
        }
        const newOrder = new orderModel({
            userId: user._id,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            paymentStatus: "Pending",
            razorpayOrderId: "",
            razorpayPaymentId: ""
        });
        await newOrder.save();
        const categoryIds = new Set();
        for (const item of items) {
            const updatedFood = await foodModel.findByIdAndUpdate(
                item._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                },
                 {
        returnDocument: "after"
    }
            );
            if (updatedFood.stock === 0) {
                await notificationModel.create({
                    type: "out_of_stock",
                    title: "Out of Stock",
                    message: `${updatedFood.name} is now out of stock.`,
                    productId: updatedFood._id
                });
            } else if (updatedFood.stock <= 10) {
                await notificationModel.create({
                    type: "low_stock",
                    title: "Low Stock Alert",
                    message: `${updatedFood.name} has only ${updatedFood.stock} items left.`,
                    productId: updatedFood._id
                });
            }
            if (updatedFood.category) {
        categoryIds.add(updatedFood.category.toString());
    }
    }
    for (const categoryId of categoryIds) {
    await categoryModel.findByIdAndUpdate(
        categoryId,
        {
            $inc: {
                orders: 1
            }
        }
    );
}
        await notificationModel.create({
            type: "new_order",
            title: "New Order Received",
            message: `New order has been placed by ${user.name}.`,
            orderId: newOrder._id,
            userId: user._id
        });
        user.cartData = {};
        await user.save();
        res.json({
            success: true,
            message: "Order placed successfully"
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};
const razorpayOrder = async(req,res)=>{
    try {
        const {amount} = req.body
        const options={
            amount:amount*100,
        currency: "INR",
            receipt: "receipt_" + Date.now()
        };
        const order = await razorpay.orders.create(options);
        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            address,
            items,
            amount
        } = req.body;
        const body =
            razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_SECRET
                )
                .update(body)
                .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            return res.json({
                success: false,
                message: "Payment Verification Failed"
            });
        }
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }
        for (const item of items) {
            const food = await foodModel.findById(item._id);
            if (!food) {
                return res.json({
                    success: false,
                    message: "Food not found"
                });
            }
            if (food.stock <= 0) {
                return res.json({
                    success: false,
                    message: `${food.name} is out of stock`
                });
            }
            if (food.stock < item.quantity) {
                return res.json({
                    success: false,
                    message:
                        `${food.name} has only ${food.stock} items available`
                });
            }
        }
        const order = new orderModel({
            userId: req.userId,
            items,
            amount,
            address,
            paymentMethod: "Online",
            payment: true,
            paymentStatus: "Success",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        });
        const existingOrder = await orderModel.findOne({
            razorpayPaymentId: razorpay_payment_id
        });
        if (existingOrder) {
            return res.json({
                success: false,
                message: "Payment already processed"
            });
        }
        await order.save();
        const categoryIds = new Set();
        for (const item of items) {
            const updatedFood =
                await foodModel.findByIdAndUpdate(
                    item._id,
                    {
                        $inc: {
                            stock: -item.quantity
                        }
                    },
                    {
                        returnDocument: "after"
                    }
                );
            if (updatedFood.stock === 0) {
                await notificationModel.create({
                    type: "out_of_stock",
                    title: "Out of Stock",
                    message:
                        `${updatedFood.name} is now out of stock.`,
                    productId: updatedFood._id
                });
            }
            else if (updatedFood.stock <= 10) {
                await notificationModel.create({
                    type: "low_stock",
                    title: "Low Stock Alert",
                    message:
                        `${updatedFood.name} has only ${updatedFood.stock} items left.`,
                    productId: updatedFood._id
                });
            }
                if (updatedFood.category) {
                categoryIds.add(updatedFood.category.toString());
            }
        }
        for (const categoryId of categoryIds) {
        await categoryModel.findByIdAndUpdate(
            categoryId,
            {
                $inc: {
                    orders: 1
                }
            }
        );
    }
        await notificationModel.create({
            type: "new_order",
            title: "New Order Received",
            message:
                `New online order has been placed by ${user.name}.`,
            orderId: order._id,
            userId: user._id
        });
        await notificationModel.create({
            type: "payment_received",
            title: "Payment Received",
            message:
                `Payment of ₹${amount} received from ${user.name}.`,
            orderId: order._id,
            userId: user._id
        });
        user.cartData = {};
        await user.save();
        res.json({
            success: true,
            message: "Payment Successful",
            orderId: order._id
        });
    } catch (error) {
        console.log(error);
      res.json({
            success: false,
            message: error.message
        });
    }
};
const getUserOrders =async(req,res)=>{
    try {
        const orders = await orderModel.find().sort("-createdAt")
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        });
    }
}
const statusUpdate = async(req,res)=>{
try {
    const {orderId,status}=req.body
    const upadatedStatus = await orderModel.findByIdAndUpdate(orderId,{status:status})
    res.json({success:true,message:"status updated"})
} catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
}
}
const getOrder = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User is not found"
            });
        }

        const orders = await orderModel
            .find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};
export {placeOrder,razorpayOrder,getUserOrders,statusUpdate,getOrder,verifyPayment}