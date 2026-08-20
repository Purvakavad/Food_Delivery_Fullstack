import express from 'express'
import {addCategory,listCategory,deleteCategory,getSingleCategory,updateCategory} from '../controllers/categoryController.js'
import upload from '../Midllerware/multer.js'
import adminAuth from '../Midllerware/adminauth.js'
import allowRoles from '../Midllerware/allowRoles.js'
const categoryRoute = express.Router()
categoryRoute.post('/add',adminAuth,allowRoles("admin"),upload.single("image"),addCategory)
categoryRoute.get('/list',listCategory)
categoryRoute.post('/delete',adminAuth,allowRoles("admin"),deleteCategory)
categoryRoute.get('/:id',getSingleCategory)
categoryRoute.put('/update/:id',adminAuth,allowRoles("admin"),upload.single("image"),updateCategory)
export default categoryRoute