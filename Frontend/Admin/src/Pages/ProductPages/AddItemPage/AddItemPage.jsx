import React from 'react'
import assets from '../../../assets/assets'
import styles from './AddItemPage.module.css'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../../Context/AdminContext'
export default function AddItemPage() {
    const [data, setData] = useState({
        name: "",
        category: "",
        price: "",
        offer_price: "",
        description: "",
        ingredients: "",
        tags: "",
        status: "",
        stock: "",
        preparationTime: ""
    })
    const { backend_url, navigate } = useContext(AdminContext)
    const [isFeatured, setIsFeatured] = useState(false)
    const [category, setCategory] = useState([])
    const [image, setImage] = useState(false)
    const onHandleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({ ...data, [name]: value })
    }
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("category", data.category)
    formData.append("price", data.price)
    formData.append("offer_price", data.offer_price)
    formData.append("description", data.description)
    formData.append("ingredients", data.ingredients)
    formData.append("tags", data.tags)
    formData.append("status", data.status)
    formData.append("image", image)
    formData.append("preparationTime", data.preparationTime)
    formData.append("isFeatured", isFeatured)
    formData.append("stock", data.stock)
    const getCategory = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/category/list`)
            if (response.data.success) {
                setCategory(response.data.category)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getCategory()
    }, [])
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            if (!image) {
                toast.error("Food image is required");
                return;
            }
            const respose = await axios.post(backend_url + "/api/food/add", formData, { withCredentials: true });
            if (respose.data.success) {
                toast.success(respose.data.message)
                navigate('/product')
            }
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
    return (
        <div className={styles.add_item_page}>
            <div className={styles.add_container}>
                <h2>Add Food Item</h2>
                <div className={styles.add_item}>
                    <form onSubmit={(e) => handleSubmit(e)} className={styles.left_container}>
                        <div className={styles.container}>
                            <h4>Basic Information</h4>
                            <div className={styles.inputs}>
                                <div className={styles.input_container}>
                                    <label htmlFor="name">Food Name </label>
                                    <input type="text" placeholder='Enter food name' onChange={(e) => onHandleChange(e)} name="name" value={data.name} required />
                                </div>
                                <div className={styles.input_container}>
                                    <label htmlFor="category">Category</label>
                                    <select className={styles.category} name="category" id="" onChange={(e) => onHandleChange(e)} name="category" value={data.category} required>
                                        <option value="">Select Category</option>
                                        {
                                            category.map((item) => (
                                                <option value={item._id}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className={styles.inputs}>
                                <div className={styles.input_container}>
                                    <label htmlFor="price">Price(₹)</label>
                                    <input type="text" placeholder='Enter price' name='price' onChange={(e) => onHandleChange(e)} value={data.price} required />
                                </div>
                                <div className={styles.input_container}>
                                    <label htmlFor="offer price">Offer Price(₹)</label>
                                    <input type="text" placeholder='Enter offer price' name='offer_price' onChange={(e) => onHandleChange(e)} value={data.offer_price} required />
                                </div>
                            </div>
                            <div className={styles.input_container}>
                                <label htmlFor="des">Food Description</label>
                                <textarea type="text" className={styles.des} placeholder='Enter food description' name='description' onChange={(e) => onHandleChange(e)} value={data.description} required />
                            </div>
                            <div className={styles.inputs}>
                                <div className={styles.input_container}><label htmlFor="foodtags">Food Tags</label>
                                    <input type="text" placeholder='Enter tags (e.g.spicy,cheesy)' onChange={(e) => onHandleChange(e)} value={data.tags} name='tags' required />
                                </div>
                                <div className={styles.stock}>
                                    <label htmlFor="">Stock</label>
                                    <input type="text" placeholder='Enter stock' name='stock' onChange={((e) => onHandleChange(e))} value={data.stock} required />
                                </div>
                            </div>
                            <div className={styles.input_container}>
                                <label htmlFor="ingredients">Ingredients</label>
                                <input type="text" placeholder='Enter ingredients (comma separated)' name="ingredients" onChange={(e) => onHandleChange(e)} value={data.ingredients} required />
                            </div>
                            <div className={styles.status}>
                                <div className={styles.input}>
                                    <label htmlFor="status" >Status</label>
                                    <div className={styles.status_container}>
                                        <label htmlFor="">
                                            <input type="radio" name='status' onChange={(e) => onHandleChange(e)} value="Active" />Active</label>
                                        <label><input type="radio" name='status' onChange={(e) => onHandleChange(e)} value="Inactive" />Inactive</label>
                                    </div>
                                </div>
                                <div className={styles.input}>
                                    <label htmlFor="time">Preparation Time</label>
                                    <select className={styles.prepare} onChange={(e) => onHandleChange(e)} value={data.preparationTime} name="preparationTime" required>
                                        <option value="5-10 min">5-10 min</option>
                                        <option value="10-15 min">10-15 min</option>
                                        <option value="15-20 min">15-20 min</option>
                                        <option value="20-25 min">20-25 min</option>
                                        <option value="25-30 min">25-30 min</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.fetured}>
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                />  fetured product
                            </div>
                            <div className={styles.btn}>
                                <button onClick={() => navigate("/product")}>Cancle</button>
                                <button>Save Food</button>
                            </div>
                        </div>
                    </form>
                    <div className={styles.right_container}>
                        <div className={styles.top_container}>
                            <h4>Food Image</h4>
                            <label htmlFor="food_image">
                                <img src={assets.img_upload} alt="" /></label>
                            <input type="file" hidden id='food_image' onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                        <div className={styles.bottom_Container}>
                            <h5>Preview</h5>
                            {!data.name == "" ? <div className={styles.preview_card}>
                                <img src={image ? URL.createObjectURL(image) : ""} className={styles.img} alt="" />
                                <div className={styles.info}>
                                    <p className={styles.name}>{data.name}</p>
                                    <p>{category.find(item => item._id == data.category)?.name || ""}</p>
                                    <p>{data.description}</p>
                                    <div className={styles.price}>
                                        <p className={styles.fprice}>&#8377;{data.offer_price}</p>
                                        <p className={`${data.status == "Active" ? styles.activeStatus : styles.inactive}`}>{data.status}</p>
                                    </div>
                                </div>
                            </div> : ""}
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}
