import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext'
import styles from './SingleProduct.module.css'
import { FaStar } from "react-icons/fa";
export default function SingleProduct() {
    const { id } = useParams()
    const {
        backend_url,
        addToCart,
        showLoginModal,
        setShowLoginModal,
        navigate
    } = useContext(StoreContext);
    const [productData, setProductData] = useState({})
    const getProduct = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/food/singleProduct/${id}`)
            if (response.data.success) {
                setProductData(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { if (id) { getProduct() } }, [id])
    return (
        <div className={styles.singleProduct}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <img
                        src={`${productData.image}`}
                        alt={productData.name}
                    />
                </div>
                <div className={styles.right}>
                    <span className={styles.category}>
                        {productData.category?.name}
                    </span>
                    <h1>{productData.name}</h1>
                    <div className={styles.rating}>
                        <FaStar className={styles.starticon} /> {productData.rating} ({productData.reviews} Reviews)
                    </div>
                    <p className={styles.description}>
                        {productData.description}
                    </p>
                    <h2 className={styles.price}>
                        ₹{productData.offer_price}
                        <span>₹{productData.price}</span>
                    </h2>
                    <div className={styles.time}>
                        ⏱ {productData.preparationTime}
                    </div>
                    <div className={styles.ingredients}>
                        <h3>Ingredients</h3>
                        <div className={styles.tags}>
                            {productData.ingredients?.[0]
                                ?.split(",")
                                .map((item, index) => (
                                    <span key={index}>{item.trim()}</span>
                                ))}
                        </div>
                    </div>
                    <button className={styles.btn} onClick={() => addToCart(productData._id)}>
                        Add To Cart
                    </button>
                </div>
            </div>

            {
                showLoginModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>Login Required</h2>

                            <p>
                                Please login to add items to your cart.
                            </p>

                            <div className={styles.modalButtons}>
                                <button
                                    className={styles.loginBtn}
                                    onClick={() => {
                                        setShowLoginModal(false);
                                        navigate("/login");
                                    }}
                                >
                                    Login
                                </button>

                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowLoginModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
