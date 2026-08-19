import foodModel from '../models/foodModel.js'
import upload  from '../Midllerware/multer.js';
import cloudinary from '../config/cloudinary.js';
import categoryModel from '../models/categoryModel.js';
const addItems = async(req,res)=>{
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const tags = req.body.tags.split(",").map(tag => tag.trim());
        const newItem = new foodModel({name:req.body.name,
            description:req.body.description,
            category:req.body.category,
            price:req.body.price
            ,offer_price:req.body.offer_price,
            ingredients:req.body.ingredients,
            tags:tags,
            status: req.body.status || "Active",
            image: result.secure_url,
            imagePublicId:result.public_id,
            preparationTime:req.body.preparationTime,
            isFeatured:req.body.isFeatured,
            stock:req.body.stock})
        await newItem.save()
        if(req.body.category){
            await categoryModel.findOneAndUpdate({_id:req.body.category},{$inc:{productCount:1}})
        }
        res.json({success:true,message:"product added"})
    } catch (error) {
        console.log(error)
    }
}
const listProducts = async(req,res)=>{
    try {
        const data = await foodModel.find()
        const totalProduct = await foodModel.countDocuments()
        const activeProduct = await foodModel.countDocuments({ status:"Active"})
        const inactiveProduct = await foodModel.countDocuments({status: "Inactive"})
        const outofstock = await foodModel.countDocuments({stock: 0})
        const popular_dishes = await foodModel.find({isFeatured:true})
        res.json({success:true,data,totalProduct,activeProduct,inactiveProduct,outofstock,popular_dishes})
    } catch (error) {
        console.log(error)
    }
}
const deleteProduct =async(req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id)
        if(food.imagePublicId){
            await cloudinary.uploader.destroy(food.imagePublicId)
        }
        const response = await foodModel.findByIdAndDelete(req.body.id)
        if (food.category) {
            await categoryModel.findByIdAndUpdate(
                food.category,
                {
                    $inc: {
                        productCount: -1
                    }
                }
            );
        }
        res.json({success:true,message:"Food Deleted"})
    } catch (error) {
        res.json({success:false,message:error})
    }
}
const singleProduct = async(req,res)=>{
    const {id} = req.params
    try {
        const response = await foodModel.findById(id).populate("category")
        res.json({success:true,data:response})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }
}
const editProducts = async(req,res)=>{
    try {
        const {name, ingredients, isFeatured, offer_price,
        status, stock, tag, price, preparationTime} =req.body;
        const updateData = {name, ingredients, isFeatured, offer_price,
        status, stock, tag, price, preparationTime}
        const food = await foodModel.findById(req.params.id)
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path,{
                            resource_type:"image"
                        })
                         if (result.secure_url) {
                            if (food.imagePublicId) {
                                await cloudinary.uploader.destroy(food.imagePublicId);
                            }
                            updateData.image = result.secure_url;
                            updateData.imagePublicId = result.public_id;
                        }
        }
        const response = await foodModel.findByIdAndUpdate(req.params.id,updateData,{ returnDocument: "after" })
        res.json({success:true,message:"Product Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error})
    }
}
export  {addItems,listProducts,deleteProduct,editProducts,singleProduct}