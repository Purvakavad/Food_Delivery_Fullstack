import express from 'express'
const cartRoute = express.Router()
import userauth from '../Midllerware/userauth.js'
import {addCartItem,getCartData,deleteCartItem,applyCoupon} from '../controllers/cartController.js'
cartRoute.post('/add',userauth,addCartItem)
cartRoute.get('/list',userauth,getCartData)
cartRoute.delete('/delete',userauth,deleteCartItem)
cartRoute.post('/apply',applyCoupon)
export default cartRoute