import jwt from 'jsonwebtoken'
const adminauth = (req,res,next) => {
    try {
        const token = req.cookies.adminToken
        if(!token){
            return res.json({success:false,message:"Please login first"})
        }
        const decoded  = jwt.verify(token,process.env.JWT_SECRET)
        if(decoded .role != "admin"){
            return res.json({success:false,message:"Unauthorized"})
        }
        req.adminId = decoded.id
        next();
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
}
export default adminauth