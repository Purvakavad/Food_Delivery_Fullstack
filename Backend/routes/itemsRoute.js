import express from 'express'
import { Router } from 'express'
import {addItems,listProducts,deleteProduct,singleProduct,editProducts} from '../controllers/itemController.js'
import upload from '../Midllerware/multer.js'
import adminAuth from '../Midllerware/adminauth.js'
import allowRoles from '../Midllerware/allowRoles.js'
const itemsRoutes = new express.Router()
itemsRoutes.post('/add',adminAuth,allowRoles("admin"), upload.single("image"),addItems)
itemsRoutes.get('/list',listProducts)
itemsRoutes.post('/delete',adminAuth,allowRoles("admin"),deleteProduct)
itemsRoutes.get('/singleProduct/:id',singleProduct)
itemsRoutes.put('/edit/:id',adminAuth,allowRoles("admin"),upload.single("image"),editProducts)
export default itemsRoutes