import React, { useState } from 'react'
import assets from '../../../assets/assets'
import styles from './AddCategory.module.css'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useContext } from 'react'
import { AdminContext } from '../../../Context/AdminContext'
export default function AddCategory() {
    const { backend_url, navigate } = useContext(AdminContext)
    const [data, setData] = useState({
        name: "",
        slug: "",
        description: "",
        status: "Active",
        featured: false
    })
    const [image, setImage] = useState(false)
    const onHandleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.error("Image is required")
            return;
        }
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("slug", data.slug)
        formData.append("description", data.description)
        formData.append("status", data.status)
        formData.append("featured", data.featured)
        formData.append("image", image)

        try {
            const response = await axios.post(backend_url + '/api/category/add', formData, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/category')
            } else {
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
        <div className={styles.add_category}>
            <div className={styles.main_conatiner}>
                <h2>Add New Category</h2>
                <form className={styles.category} onSubmit={handleSubmit}>
                    <div className={styles.container}>
                        <div className={styles.left_part}>
                            <div>
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
                                <div className={styles.category_img}>
                                    <label htmlFor="img">Category Image<br />
                                        <img src={assets.img_upload} className={styles.img} alt="" />
                                    </label>
                                    <input type="file" hidden id='img' onChange={(e) => setImage(e.target.files[0])} name="image" />
                                </div>
                            </div>
                        </div>
                        <div className={styles.right_part}>
                            <h4>Category Image Preview</h4>
                            <img src={image ? URL.createObjectURL(image) : assets.pre_img} alt="" />
                            <p>Image preview will appear here</p>
                            <div className={styles.info}>
                                <p>{data.name}</p>
                                <p>{data.slug}</p>
                                <p>{data.description}</p>
                                <p>{data.status}</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.btn}>
                        <button onClick={() => navigate("/category")}>Cancel</button>
                        <button className={styles.orange}>Save Category</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
