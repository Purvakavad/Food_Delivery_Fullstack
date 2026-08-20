import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './EditCategory.module.css'
import assets from '../../../assets/assets.js'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { AdminContext } from '../../../Context/AdminContext.jsx'
export default function EditCategory() {
    const { id } = useParams()
    const [data, setData] = useState({
        name: "",
        description: "",
        slug: "",
        featured: "",
        status: ""
    })
    const fileref = useRef(null)
    const [image, setImage] = useState()
    const { backend_url, navigate } = useContext(AdminContext)
    const getCategoryData = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/category/${id}`)
            if (response.data.success) {
                setData({
                    name: response.data.category.name,
                    description: response.data.category.description,
                    slug: response.data.category.slug,
                    featured: response.data.category.featured,
                    status: response.data.category.status,
                    image: response.data.category.image
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { getCategoryData() }, [])
    const onHandleChange = (e) => {
        const { name, value, checked, type } = e.target
        setData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData
            formData.append("name", data.name);
            formData.append("slug", data.slug)
            formData.append("description", data.description)
            formData.append("status", data.status)
            formData.append("featured", data.featured)
            formData.append("image", image)
            const response = await axios.put(`${backend_url}/api/category/update/${id}`, formData, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                navigate('/category')
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
    return (
        <div className={styles.category}>
            <div className={styles.categor_page}>
                <h4>Edit Category</h4>
                <form className={styles.edit_category} onSubmit={handleSubmit}>
                    <div className={styles.top_conatiner}>
                        <div className={styles.container}>
                            <div className={styles.inputs}>
                                <label htmlFor="name">Catgory Name</label><br />
                                <input type="text" placeholder='Enter category name' onChange={(e) => onHandleChange(e)} value={data.name} name="name" required />
                            </div>
                            <div className={styles.inputs}>
                                <label htmlFor="Slug">Slug</label><br />
                                <input type="text" placeholder='Enter slug(url-friendly)' onChange={(e) => onHandleChange(e)} value={data.slug} name="slug" required />
                            </div>
                            <div className={styles.inputs}>
                                <label htmlFor="">Description</label><br />
                                <textarea placeholder='Enter category description' className={styles.des} onChange={(e) => onHandleChange(e)} value={data.description} name="description" required></textarea>
                            </div>
                            <div className={styles.inputs}>
                                <label htmlFor="">Status</label><br />
                                <select onChange={(e) => onHandleChange(e)} value={data.status} name="status" required>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className={styles.show_home}>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={data.featured}
                                    onChange={onHandleChange}
                                />Show in Home Page
                            </div>
                        </div>
                        <div className={styles.category_img}>
                            <h5>Category Image </h5>
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
                        <button type="button" onClick={() => navigate('/category')}>Cancel</button>
                        <button className={styles.orange}>Save Category</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
