import React, { useContext, useEffect, useState } from "react";
import {
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaRupeeSign,
    FaArrowUp,
    FaPlus,
    FaClipboardList,
    FaTags
} from "react-icons/fa";
import styles from "./Dashboard.module.css";
import { AdminContext } from "../../Context/AdminContext";
import axios from 'axios'

const Dashboard = () => {
    const [data, setData] = useState([])
    const { backend_url, navigate, adminData } = useContext(AdminContext)
    const getFoodInfo = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/user/foodinfo`, { withCredentials: true })
            if (response.data.success) {
                setData(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { getFoodInfo() }, [])
    return (
        <div className={styles.dashboard}>
            <div className={styles.dashborde_content}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back, {adminData?.name}</p>
                    </div>
                    <button className={styles.addBtn} onClick={() => navigate("/product/add")}>
                        <FaPlus />
                        Add Product
                    </button>
                </div>
                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.card}>
                        <div className={styles.iconBox}>
                            <FaBoxOpen />
                        </div>
                        <div>
                            <h2>{data.totalProducts}</h2>
                            <p>Total Products</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.iconBox}>
                            <FaShoppingCart />
                        </div>
                        <div>
                            <h2>{data.totalOrders}</h2>
                            <p>Total Orders</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.iconBox}>
                            <FaUsers />
                        </div>
                        <div>
                            <h2>{data.totalUsers}</h2>
                            <p>Total Users</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.iconBox}>
                            <FaRupeeSign />
                        </div>
                        <div>
                            <h2>₹{data.totalRevenue}</h2>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                </div>
                {/* Bottom */}
                <div className={styles.bottom}>
                    <div className={styles.left}>
                        <div className={styles.box}>
                            <div className={styles.revenueTop}>
                                <div>
                                    <h3>Revenue</h3>
                                    <p>Total Revenue</p>
                                </div>
                                <span
                                    className={
                                        data.growth >= 0
                                            ? styles.increase
                                            : styles.decrease
                                    }
                                >
                                    {data.growth >= 0
                                        ? "Revenue Increased"
                                        : "Revenue Decreased"}
                                </span>
                            </div>
                            <h1 className={styles.revenueAmount}>
                                ₹{data.totalRevenue || 0}
                            </h1>
                            <div className={styles.revenueInfo}>
                                <div className={styles.infoCard}>
                                    <p>This Month</p>
                                    <h4>₹{data.currentMonthRevenue || 0}</h4>
                                </div>
                                <div className={styles.infoCard}>
                                    <p>Last Month</p>
                                    <h4>₹{data.previousMonthRevenue || 0}</h4>
                                </div>
                            </div>
                            <p className={styles.compareText}>
                                {
                                    data.previousMonthRevenue === 0
                                        ? "No previous month data available."
                                        : <>
                                            <span
                                                className={
                                                    data.growth >= 0
                                                        ? styles.increase
                                                        : styles.decrease
                                                }
                                            >
                                                {data.growth >= 0 ? "+" : "-"}
                                                {Math.abs(data.growth || 0)}%
                                            </span>
                                            {" "}compared to last month
                                        </>
                                }
                            </p>
                        </div>
                        <div className={styles.box}>
                            <h3>Recent Orders</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Food</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.recentOrders?.map((item) => (
                                            < tr key={item._id}>
                                                <td>{item.address.firstName + " " + item.address.lastName}</td>
                                                <td>{item.items.map((i) => i.name).join(", ")}</td>
                                                <td>{item.status}</td>
                                                <td>₹{item.amount}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.box}>
                            <h3 className={styles.actions}>Quick Actions</h3>
                            <button onClick={() => navigate('/product/add')}>
                                <FaPlus />
                                Add Product
                            </button>
                            <button onClick={() => navigate("/Orders")}>
                                <FaClipboardList />
                                View Orders
                            </button>
                            <button onClick={() => navigate('/category')}>
                                <FaTags />
                                Manage Categories
                            </button>
                        </div>
                        <div className={styles.box}>
                            <h3>Top Selling</h3>
                            <ul>
                                {
                                    data.topSelling?.map((item) => (
                                        <li className={styles.topProduct}> <img src={item.image} alt="topselling food images" className={styles.topfoodimg} /> {item.name}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;