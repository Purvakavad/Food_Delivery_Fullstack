import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import styles from './Cart.module.css'
import { FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
export default function Cart() {
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState("");
    const { backend_url, cartItems, setCartItems, totalDiscount, increment, decrement, navigate, cartData, fetchCart, totalAmount, deliveryFee } = useContext(StoreContext)
    const handleClick = async (id) => {
        try {
            const response = await axios.delete(`${backend_url}/api/cart/delete`, {
                data: { id }, withCredentials: true
            })
            if (response.data.success) {
                fetchCart()
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { fetchCart() }, [])
    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter coupon code");
            return;
        }
        try {
            const response = await axios.post(
                `${backend_url}/api/coupon/apply`,
                {
                    code: couponCode,
                    amount: totalAmount
                },
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setCouponDiscount(response.data.discount);
                setAppliedCoupon(response.data.coupon);
                localStorage.setItem(
                    "appliedCoupon",
                    response.data.coupon
                );
                toast.success("Coupon applied successfully");
            } else {
                setCouponDiscount(0);
                setAppliedCoupon("");
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
    useEffect(() => {
        const savedCoupon = localStorage.getItem("appliedCoupon");
        if (savedCoupon) {
            setAppliedCoupon(savedCoupon);
            setCouponCode(savedCoupon);
        }
    }, []);
    useEffect(() => {
        const savedCoupon = localStorage.getItem("appliedCoupon");
        if (!savedCoupon || totalAmount <= 0) {
            return;
        }
        const recalculateCoupon = async () => {
            try {
                const response = await axios.post(
                    `${backend_url}/api/coupon/apply`,
                    {
                        code: savedCoupon,
                        amount: totalAmount
                    },
                    {
                        withCredentials: true
                    }
                );
                if (response.data.success) {
                    setAppliedCoupon(response.data.coupon);
                    setCouponCode(response.data.coupon);
                    setCouponDiscount(response.data.discount);
                } else {
                    localStorage.removeItem("appliedCoupon");
                    setAppliedCoupon("");
                    setCouponCode("");
                    setCouponDiscount(0);
                }
            } catch (error) {
                console.log(error);
            }
        };
        recalculateCoupon();
    }, [totalAmount]);
    const removeCoupon = () => {
        localStorage.removeItem("appliedCoupon");
        setCouponCode("");
        setAppliedCoupon("");
        setCouponDiscount(0);
        toast.success("Coupon removed");
    };
    return (
        <section className={styles.cart}>
            <div className={styles.left}>
                <h2>My Cart</h2>
                <p>{cartItems.length} Items</p>
                <div className={styles.cart_container}>
                    <div className={styles.thead}>
                        <p>Item</p>
                        <p>Offer Price</p>
                        <p>Quantity</p>
                        <p>Subtotal</p>
                        <p>Remove</p>
                    </div>
                    {
                        cartItems.map((item) => (
                            <div className={styles.cart_card} key={item._id}>
                                <div className={styles.food}>
                                    <img src={item.image} alt="" />
                                    <div>
                                        <h3>{item.name}</h3>
                                    </div>
                                </div>
                                <p className={styles.price}>₹{item.offer_price}
                                    {item.price > item.offer_price && (
                                        <span className={styles.originalPrice}>
                                            ₹{item.price}
                                        </span>
                                    )}
                                </p>
                                <div className={styles.quantity}>
                                    <button onClick={() => decrement(item._id)}>
                                        <FaMinus />
                                    </button>
                                    <span>{cartData[item._id]}</span>
                                    <button onClick={() => increment(item._id)}>
                                        <FaPlus />
                                    </button>
                                </div>
                                <h3 className={styles.total}>
                                    ₹{item.offer_price * cartData[item._id]}
                                </h3>
                                <button className={styles.delete} onClick={() => handleClick(item._id)}>
                                    <FaTrashAlt />
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.summary}>
                    <h2>Order Summary</h2>
                    <div className={styles.row}>
                        <span>Subtotal</span>
                        <span>₹{totalAmount}</span>
                    </div>
                    <div className={styles.row}>
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee}</span>
                    </div>
                    <div className={styles.row}>
                        <span>You Saved</span>
                        <span>₹{totalDiscount}</span>
                    </div>
                    {couponDiscount > 0 && (
                        <div className={styles.row}>
                            <span>Coupon ({appliedCoupon})</span>
                            <span>-₹{couponDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <hr />
                    <div className={styles.total_row}>
                        <span>Total</span>
                        <span>₹{totalAmount + deliveryFee - couponDiscount.toFixed(2)}</span>
                    </div>
                    <div className={styles.coupon}>
                        <input
                            type="text"
                            placeholder="Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button onClick={applyCoupon} disabled={!!appliedCoupon}>
                            {appliedCoupon ? "Applied" : "Apply"}
                        </button>
                    </div>
                    {appliedCoupon && (
                        <div className={styles.removecoupon}>
                            <p className={styles.couponSuccess}>
                                {appliedCoupon} applied successfully
                            </p>
                            <button onClick={removeCoupon}>
                                Remove
                            </button>
                        </div>
                    )}
                    <button className={styles.checkout} onClick={() => navigate('/palceorder')}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </section>
    );
};
