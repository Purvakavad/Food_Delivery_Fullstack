import express from 'express'
const orderRoute =express.Router()
import authuser from '../Midllerware/userauth.js'
import adminauth from '../Midllerware/adminauth.js'
import { placeOrder,razorpayOrder,verifyPayment,getUserOrders,statusUpdate,getOrder } from '../controllers/orderController.js'
orderRoute.post('/place',authuser,placeOrder)
orderRoute.post('/razorpay',authuser,razorpayOrder)
orderRoute.post("/verify", authuser, verifyPayment);
orderRoute.get('/user-orders',adminauth,getUserOrders);
orderRoute.get('/orders',authuser,getOrder)
orderRoute.post('/status',authuser,statusUpdate)
export default orderRoute