import React, { useContext, useEffect, useState } from "react";
import styles from "./MyOrders.module.css";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
const MyOrders = () => {
    const { backend_url, cartData } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                `${backend_url}/api/order/orders`,
                {
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);
    return (
        <div className={styles.myOrders}>
            <h2 className={styles.heading}>My Orders</h2>
            {
                orders.length === 0 ? (
                    <div className={styles.empty}>
                        No Orders Found
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            className={styles.orderCard}
                            key={order._id}
                        >
                            <div className={styles.left}>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                                    alt=""
                                    className={styles.orderImage}
                                />
                                <div>
                                    <h3 className={styles.orderTitle}>
                                        {
                                            order.items.map((item) => (
                                                item.name
                                            )).join(", ")
                                        }
                                    </h3>
                                    <p className={styles.orderItems}>
                                        {
                                            order.items.map((item) => (
                                                `${item.name} x ${item.quantity}`
                                            )).join(", ")
                                        }
                                    </p>
                                    <p className={styles.address}>
                                        {order.address.street},{" "}
                                        {order.address.city},{" "}
                                        {order.address.state}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <p>
                                    <b>Items :</b> {order.items.length}
                                </p>
                                <p>
                                    <b>Total :</b> ₹{order.amount}
                                </p>
                                <p>
                                    <b>Payment :</b>{" "}
                                    {order.payment ? "Paid" : "Pending"}
                                </p>
                                <p className={styles.status}>
                                    ● {order.status}
                                </p>
                                <button
                                    className={styles.trackBtn}
                                    onClick={fetchOrders}
                                >
                                    Refresh Status
                                </button>
                            </div>
                        </div>
                    ))
                )
            }
        </div>
    );
};
export default MyOrders;