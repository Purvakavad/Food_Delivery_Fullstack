import mongoose, { mongo } from 'mongoose'
const foodSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },price:{type:Number,required:true},
    offer_price:{type:Number},
    image:{type:String,required:true},
    imagePublicId: {
    type: String,
    default: ""
    },
    ingredients:[{type:String}],
   tags: {
    type: [String],
    default: []
},
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    preparationTime: {
      type: String,
      default: "20-25 min",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    stock:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
)
const foodModel = mongoose.models.food|| mongoose.model("food",foodSchema)
export default foodModel