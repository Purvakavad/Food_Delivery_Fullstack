import jwt from 'jsonwebtoken'
const authuser = async(req,res,next)=>{
    try {
        const token = req.cookies.userToken
        if(!token){
            return res.json({success:false,message:"Please login first."})
        }
        const decode = await jwt.verify(token,process.env.JWT_SECRET)
        req.userId = decode.id
        next()
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }}
    export default authuser