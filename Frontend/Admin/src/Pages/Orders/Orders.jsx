import React, { useEffect, useState } from "react";
import styles from "./Orders.module.css";
import axios from "axios";
import { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { backend_url } = useContext(AdminContext)
    const orderperpage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                `${backend_url}/api/order/user-orders`,
                {
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                setOrders(response.data.orders);
                setCurrentPage(1);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);
    const totalPages = Math.ceil(orders.length / orderperpage);
    const lastIndex = currentPage * orderperpage;
    const firstIndex = lastIndex - orderperpage;
    const currentOrders = orders.slice(firstIndex, lastIndex);
    const visibleButtons = 3;
    const startPage =
        Math.floor((currentPage - 1) / visibleButtons) * visibleButtons + 1;
    const endPage = Math.min(
        startPage + visibleButtons - 1,
        totalPages
    );
    const updateStatus = async (orderId, status) => {
        try {
            const response = await axios.post(
                `${backend_url}/api/order/status`,
                {
                    orderId,
                    status
                },
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                fetchOrders();
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={styles.order_page}>
            <div className={styles.orders}>
                <h2 className={styles.heading}>Orders</h2>
                {
                    currentOrders.map((order) => (
                        <div
                            key={order._id}
                            className={styles.orderCard}
                        >
                            <div className={styles.left}>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                                    alt=""
                                    className={styles.orderImage}
                                />
                                <div>
                                    <h3>
                                        {
                                            order.items
                                                .map(item => item.name)
                                                .join(", ")
                                        }
                                    </h3>
                                    <p className={styles.customer}>
                                        {order.address.firstName} {order.address.lastName}
                                    </p>
                                    <p>
                                        {order.address.street},
                                        {order.address.city},
                                        {order.address.state},
                                        {order.address.country}
                                    </p>
                                    <p>
                                        {order.address.phone}
                                    </p>
                                    <p>
                                        {
                                            order.items
                                                .map(item =>
                                                    `${item.name} x ${item.quantity}`
                                                )
                                                .join(", ")
                                        }
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
                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        updateStatus(order._id, e.target.value)
                                    }
                                >
                                    <option value="Order Placed">Order Placed</option>
                                    <option value="Food Processing">
                                        Food Processing
                                    </option>
                                    <option value="Out for Delivery">
                                        Out for Delivery
                                    </option>
                                    <option value="Delivered">
                                        Delivered
                                    </option>
                                </select>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>
                        {
                            Array.from(
                                { length: endPage - startPage + 1 },
                                (_, index) => {
                                    const page = startPage + index;
                                    return (
                                        <button
                                            key={page}
                                            className={
                                                currentPage === page
                                                    ? styles.activePage
                                                    : ""
                                            }
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                            )
                        }
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default Orders;