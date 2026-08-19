import React, { useContext, useState } from "react";
import styles from "./PlaceOrder.module.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from 'react-toastify'
const loadRazorpay = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};
const PlaceOrder = () => {
    const { cartItems, cartData, backend_url, totalAmount, fetchCart, navigate } =
        useContext(StoreContext);
    const [payMethod, setPayMethod] = useState("COD")
    const [address, setAddress] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    });
    const handleChange = (e) => {
        setAddress((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const deliveryFee = totalAmount > 0 ? 40 : 0;
    const grandTotal = totalAmount + deliveryFee;
    const placeOrder = async (e) => {
        e.preventDefault();
        const orderItems = cartItems
            .filter((item) => cartData[item._id] > 0)
            .map((item) => ({
                ...item,
                quantity: cartData[item._id],
            }));
        if (payMethod === "COD") {
            try {
                const response = await axios.post(
                    `${backend_url}/api/order/place`,
                    {
                        address,
                        items: orderItems,
                        amount: grandTotal,
                    },
                    {
                        withCredentials: true,
                    }
                );
                if (response.data.success) {
                    toast.success("Order Placed Successfully");
                    fetchCart();
                    navigate('/myorder')
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            }
        } else {
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast.error("Razorpay failed to load");
                return;
            }
            const response = await axios.post(
                `${backend_url}/api/order/razorpay`,
                {
                    amount: grandTotal
                },
                {
                    withCredentials: true
                }
            );
            const order = response.data.order;
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: order.amount,
                currency: order.currency,
                name: "BiteBuddy",
                description: "Food Order",
                order_id: order.id,
                handler: async function (response) {
                    const verify = await axios.post(
                        `${backend_url}/api/order/verify`,
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            address,
                            items: orderItems,
                            amount: grandTotal
                        },
                        {
                            withCredentials: true
                        }
                    );
                    if (verify.data.success) {
                        toast.success("Payment Successful");
                        fetchCart();
                        navigate('/myorder')
                    } else {
                        toast.error("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: address.firstName,
                    email: address.email,
                    contact: address.phone
                },
                theme: {
                    color: "#ff6b35"
                }
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        }
    };
    return (
        <form className={styles.placeOrder} onSubmit={placeOrder}>
            <div className={styles.placeOrderLeft}>
                <h2>Delivery Information</h2>
                <div className={styles.multiField}>
                    <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        onChange={handleChange} required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        onChange={handleChange} required
                    />
                </div>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange} required
                />
                <input
                    type="text"
                    placeholder="Street"
                    name="street"
                    onChange={handleChange} required
                />
                <div className={styles.multiField}>
                    <input
                        type="text"
                        placeholder="City"
                        name="city"
                        onChange={handleChange} required
                    />
                    <input
                        type="text"
                        placeholder="State"
                        name="state"
                        onChange={handleChange} required
                    />
                </div>
                <div className={styles.multiField}>
                    <input
                        type="text"
                        placeholder="Zip Code"
                        name="zipcode"
                        onChange={handleChange} required
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        name="country"
                        onChange={handleChange} required
                    />
                </div>
                <input
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    onChange={handleChange} required
                />
            </div>
            <div className={styles.placeOrderRight}>
                <div className={styles.cartTotal}>
                    <h2>Cart Totals</h2>
                    <div className={styles.cartTotalDetails}>
                        <p>Subtotal</p>
                        <p>₹{totalAmount}</p>
                    </div>
                    <div className={styles.cartTotalDetails}>
                        <p>Delivery Fee</p>
                        <p>₹{deliveryFee}</p>
                    </div>
                    <hr />
                    <div className={styles.cartTotalDetails}>
                        <b>Total</b>
                        <b>₹{grandTotal}</b>
                    </div>
                </div>
                <div className={styles.paymentMethod}>
                    <h3>Payment Method</h3>
                    <div className={styles.paymentOptions}>
                        <button type="button" onClick={() => setPayMethod("COD")} className={payMethod === "COD" ? styles.btnactive : ""}>Cash On Delivery</button>
                        <button type="button" onClick={() => setPayMethod("Online")} className={payMethod === "Online" ? styles.btnactive : ""}>Online Payment</button>
                    </div>
                </div>
                <button
                    className={styles.placeBtn}
                    type="submit"
                >
                    PLACE ORDER
                </button>
            </div>
        </form>
    );
};
export default PlaceOrder;