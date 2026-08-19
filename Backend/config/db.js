import mongoose from 'mongoose'
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}
export default connectDB