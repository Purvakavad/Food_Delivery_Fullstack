import mongoose from 'mongoose'
const categorySchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    slug:{type:String,required:true, unique: true},
    productCount:{type:Number,default:0},
    image:{type:String,required:true},
    imagePublicId:{type:String,default:""},
    orders:{type:Number,required:true,default:0},
    description:{type:String,required:true},
    featured:{type:Boolean,default:false},
    status:{type:String,enum:["Active","Inactive"],default:"Active"}
},{
    timestamps: true,
  }
)
const categoryModel = mongoose.models.category || mongoose.model("category",categorySchema)
export default categoryModel