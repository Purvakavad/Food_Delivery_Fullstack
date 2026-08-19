import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    items:[
        {
            _id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"food",
                required:true
            },
            name:String,image:String,price:String,offer_price:String,quantity:Number
        }
    ],
    amount: {
        type: Number,
        required: true,
    },
    address: {
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
        phone: String,
    },
    razorpayOrderId: {
    type: String,
    default: ""
},
razorpayPaymentId: {
    type: String,
    default: ""
},
paymentStatus: {
    type: String,
    enum: [
        "Pending",
        "Success",
        "Failed",
        "Refunded"
    ],
    default: "Pending"
},
    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        default: "COD",
    },
    payment: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: [
        "Food Processing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Order Placed"
        ],
        default: "Order Placed",
    },
    },
    {
        timestamps: true,
    })
    const orderModel = mongoose.models.Order || mongoose.model("Order",orderSchema)
    export default orderModel
