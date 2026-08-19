import foodModel from '../models/foodModel.js'
import userModel from '../models/userModel.js'
const addCartItem = async(req,res)=>{
    try {
        const {itemId,action} = req.body
        const user = await userModel.findById(req.userId)
        if (user.cartData[itemId]) {
            if (action === "increment") {
                user.cartData[itemId] += 1;
            } else if (action === "decrement") {
                if (user.cartData[itemId] > 1) {
                    user.cartData[itemId] -= 1;
                } else {
                    delete user.cartData[itemId];
                }
            }
            
        } else {
                if (action !== "decrement") {
                    user.cartData[itemId] = 1;
                }
        }
            user.markModified("cartData");
        await user.save();
    res.json({success:true,message:"product added into cart"})
    } catch (error) {
        (error)
        res.json({success:false,message:error.message})
    }
}
const getCartData = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        let cartData = [];
        for (const [itemId, quantity] of Object.entries(user.cartData)) {
            if (!itemId) continue;   
            const food = await foodModel.findById(itemId);
            if (food) {
                cartData.push({
                    ...food.toObject()                   
                });
            }
        }
        res.json({
            success: true,
            items: cartData,
            cart: user.cartData
        });
    } catch (error) {
        (error);
        res.json({
            success: false,
            message: error.message
        });
    }
}
const deleteCartItem =async(req,res)=>{
    try {
        const {id} = req.body
        const user = await userModel.findById(req.userId)
        if (user.cartData[id]) {
            delete user.cartData[id];
            user.markModified("cartData"); 
            await user.save();
        }
        res.json({
            success: true,
            message: "Item removed from cart"
        });
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}
const applyCoupon = async (req, res) => {
    try {
        const { code, amount } = req.body;
        if (!code) {
            return res.json({
                success: false,
                message: "Please enter coupon code"
            });
        }
        if (code.toUpperCase() !== "BITE20") {
            return res.json({
                success: false,
                message: "Invalid coupon code"
            });
        }
        const discount = (amount * 20) / 100;
        const finalAmount = amount - discount;
        return res.json({
            success: true,
            coupon: "BITE20",
            discount,
            finalAmount
        }); 
    } catch (error) {
        (error);
        return res.json({
            success: false,
            message: "Something went wrong"
        });
    }
};
export {addCartItem,getCartData,deleteCartItem,applyCoupon}