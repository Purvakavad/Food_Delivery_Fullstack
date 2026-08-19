import express from 'express'
import {userLogin,userRegistetion,adminLogin,checkAuth,getUser,editUserProfile,editUserPassword,logoutUser,getAdminInfo,getFoodInfo,editadminPwd,editAdminProfile,logoutAdmin,getAllUsers,getSingleUser,deleteUser,getNotifications,adminSearch} from '../controllers/userController.js'
import adminauth from '../Midllerware/adminauth.js'
import authuser from '../Midllerware/userauth.js'
import upload from '../Midllerware/multer.js'
const userRoute = express.Router()
userRoute.post('/login',userLogin)
userRoute.post('/registetion',userRegistetion)
userRoute.get('/me',authuser,getUser)
userRoute.get('/checkauth',adminauth,checkAuth)
userRoute.put('/editprofile', upload.single("image"),authuser,editUserProfile)
userRoute.put('/edituserpassword',authuser,editUserPassword)
userRoute.post("/logout", logoutUser);
userRoute.post('/adminlogin',adminLogin)
userRoute.get('/adminuser',adminauth,getAdminInfo)
userRoute.get("/foodinfo",adminauth,getFoodInfo)
userRoute.put('/editadminprofile',upload.single("image"),adminauth,editAdminProfile)
userRoute.put('/editadminpwd',adminauth,editadminPwd)
userRoute.get('/list',adminauth,getAllUsers)
userRoute.get('/notifications',adminauth,getNotifications)
userRoute.get("/search", adminSearch);
userRoute.post("/adminlogout",logoutAdmin)
userRoute.get('/:id',adminauth,getSingleUser)
userRoute.delete('/deleteuser',adminauth,deleteUser)
export default userRoute