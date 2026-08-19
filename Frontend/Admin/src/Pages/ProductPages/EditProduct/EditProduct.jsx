import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import styles from './EditProduct.module.css'
import { useRef } from 'react'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AdminContext } from '../../../Context/AdminContext'
export default function EditProduct() {
    const { id } = useParams()
    const { navigate, backend_url } = useContext(AdminContext)
    const [data, setData] = useState({
        name: "", image: "", ingredients: "", isFeatured: false, offer_price: "",
        status: "", stock: "", tags: "", price: "", preparationTime: ""
    })
    const [image, setImage] = useState("")
    const fileref = useRef()
    const getProductData = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/food/singleProduct/${id}`)
            if (response.data.success) {
                setData({
                    name: response.data.data.name,
                    offer_price: response.data.data.offer_price,
                    price: response.data.data.price,
                    status: response.data.data.status,
                    stock: response.data.data.stock,
                    tags: response.data.data.tags,
                    ingredients: response.data.data.ingredients,
                    isFeatured: response.data.data.isFeatured,
                    image: response.data.data.image,
                    preparationTime: response.data.data.preparationTime
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { getProductData() }, [])
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const formData = new FormData()
            formData.append("name", data.name)
            formData.append("price", data.price)
            formData.append("offer_price", data.offer_price)
            formData.append("ingredients", data.ingredients)
            formData.append("tags", data.tags)
            formData.append("image", image)
            formData.append("status", data.status)
            formData.append("stock", data.stock)
            formData.append("isFeatured", data.isFeatured)
            formData.append("preparationTime", data.preparationTime)
            const response = await axios.put(`${backend_url}/api/food/edit/${id}`, formData, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message)
                navigate('/product')
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const onHandleChange = (e) => {
        const { value, type, checked, name } = e.target
        setData((data) => ({ ...data, [name]: type == "checkbox" ? checked : value }))
    }
    return (
        <div className={styles.product}>
            <div className={styles.product_page}>
                <h4>Edit Product</h4>
                <form className={styles.edit_product} onSubmit={handleSubmit}>
                    <div className={styles.top_conatiner}>
                        <div className={styles.container}>
                            <div className={styles.inputs}>
                                <label htmlFor="name">Product Name</label>
                                <input type="text" placeholder='Enter product name' onChange={(e) => onHandleChange(e)} value={data.name} name="name" required />
                            </div>
                            <div className={styles.input_container}>
                                <div className={styles.inputs}>
                                    <label htmlFor="Slug">Price</label>
                                    <input type="text" placeholder='Enter price' onChange={(e) => onHandleChange(e)} value={data.price} name="price" required />
                                </div>
                                <div className={styles.inputs}>
                                    <label htmlFor="Slug">Offer Price</label>
                                    <input type="text" placeholder='Enter offer price' onChange={(e) => onHandleChange(e)} value={data.offer_price} name="offer_price" required />
                                </div>
                            </div>
                            <div className={styles.inputs}>
                                <label htmlFor="">ingredients</label>
                                <input type='text' placeholder='Enter ingredients' className={styles.des} onChange={(e) => onHandleChange(e)} value={data.ingredients} name="ingredients" required></input>
                            </div>
                            <div className={styles.input_container}>
                                <div className={styles.inputs}>
                                    <label htmlFor="">Status</label>
                                    <select onChange={(e) => onHandleChange(e)} value={data.status} name="status" required>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className={styles.inputs}>
                                    <label htmlFor="">Stock</label>
                                    <input type='text' placeholder='Enter stock' onChange={(e) => onHandleChange(e)} value={data.stock} name="stock" required></input>
                                </div>
                            </div>
                            <div className={styles.input_container}>
                                <div className={styles.inputs}>
                                    <label htmlFor="">Tags</label>
                                    <input type='text' placeholder='Enter tags' className={styles.des} onChange={(e) => onHandleChange(e)} value={data.tags} name="tags" required></input>
                                </div>
                                <div className={styles.inputs}>
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
                            <div className={styles.show_home}>
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={data.isFeatured}
                                    onChange={onHandleChange}
                                />Show in Home Page
                            </div>
                        </div>
                        <div className={styles.product_img}>
                            <h5>Product Image </h5>
                            <div className={styles.show_img}>
                                <img src={image ? URL.createObjectURL(image) : data.image} className={styles.img} alt="" />
                            </div>
                            <div className={styles.img_input}>
                                <button type='button' onClick={() => fileref.current.click()}>Change Image</button>
                                <input type="file" hidden ref={fileref} onChange={(e) => setImage(e.target.files[0])} />
                                <p>JPG,PNG or webP.Max size:2MB</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.btn}>
                        <button type="button"
                            onClick={() => navigate('/product')}>Cancel</button>
                        <button className={styles.orange}>Update Product</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
