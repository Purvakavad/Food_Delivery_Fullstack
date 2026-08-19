import cloudinary from '../config/cloudinary.js'
import categoryModel from '../models/categoryModel.js'
import foodModel from '../models/foodModel.js'
const addCategory =async(req,res)=>{
    try {
           const duplicate = await categoryModel.findOne({name: { $regex:`^${req.body.name}$`, $options: "i" }});
        if(duplicate){
            res.json({success:false,message:"category already exits"})
            return;
        }
        const result = await cloudinary.uploader.upload(req.file.path)
        const newCategory = new categoryModel({
            name:req.body.name,
            slug:req.body.slug,
            description:req.body.description,
            featured:req. body.featured,
            status:req.body.status,
            image:result.secure_url,
            imagePublicId:result.public_id
        })
        await newCategory.save()
        res.json({success:true,message:"category added"})
    } catch (error) {
        (error)
        res.json({success:false,message:error})
    }
}
const listCategory =async(req,res)=>{
    try {
        const category = await categoryModel.find()
        const totalCategory = await categoryModel.countDocuments();
        const activeCategory = await categoryModel.countDocuments({status:"Active"})
        const inactiveCategory = await categoryModel.countDocuments({status:"Inactive"})
        const totalProduct = await foodModel.countDocuments()
        res.json({success:true,category,totalCategory,activeCategory,inactiveCategory,totalProduct})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
const deleteCategory =async(req,res)=>{
    try{
    const category = await categoryModel.findById(req.body.id)
    if(category.imagePublicId){
        await cloudinary.uploader.destroy(category.imagePublicId)
    }
    const response = await categoryModel.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"Category Deleted"})
    }catch(error){
        console.log(error)
        res.json({success:false,message:error})
    };
}
const getSingleCategory = async(req,res) => {
    try {
        const data = await categoryModel.findById(req.params.id)
        res.json({success:true,category:data})
    } catch (error) {
        (error)
        res.json({success:false,message:error})
    }
}
const updateCategory =async(req,res)=>{
    try {
        const {name,slug,description,status,featured} = req.body
        const updateData = {name,slug,description,status,featured}
        const category = await categoryModel.findById(req.params.id)
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path,{
                resource_type:"image"
            })
            updateData.image = result.secure_url
            if(result.secure_url){
                if(category.imagePublicId){
                    await cloudinary.uploader.destroy(category.imagePublicId)
                }
            }
            updateData.imagePublicId = result.public_id
        }
        const response = await categoryModel.findByIdAndUpdate(req.params.id,updateData,{new:true})
        res.json({success:true,message:"Category updated successfully"})
    } catch (error) {
        res.json({success:false,message:error})
    }
}
export  {addCategory,listCategory,deleteCategory,getSingleCategory,updateCategory}