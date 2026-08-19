import express from 'express'
import {addCategory,listCategory,deleteCategory,getSingleCategory,updateCategory} from '../controllers/categoryController.js'
import upload from '../Midllerware/multer.js'
import adminAuth from '../Midllerware/adminauth.js'
const categoryRoute = express.Router()
categoryRoute.post('/add',adminAuth,upload.single("image"),addCategory)
categoryRoute.get('/list',listCategory)
categoryRoute.post('/delete',adminAuth,deleteCategory)
categoryRoute.get('/:id',getSingleCategory)
categoryRoute.put('/update/:id',adminAuth,upload.single("image"),updateCategory)
export default categoryRoute