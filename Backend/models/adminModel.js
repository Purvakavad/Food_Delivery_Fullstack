import mongoose from "mongoose";
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
            type: String,
            enum: ["admin", "demoAdmin"],
            default: "admin"
        },
    image:{
      type:String,
      default:""
    },imagePublicId:{
      type:String,default:""
    }
  },
  {
    timestamps: true,
  }
);
const adminModel = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default adminModel;