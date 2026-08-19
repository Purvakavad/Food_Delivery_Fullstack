import React, { useContext, useEffect, useState } from "react";
import styles from "./UserDetails.module.css";
import { FaUserCircle, FaEnvelope, FaShoppingBag, FaRupeeSign, FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../../../Context/AdminContext";

const UserDetails = () => {
    const { id } = useParams();
    const { backend_url, navigate } = useContext(AdminContext)
    const [user, setUser] = useState(null);
    const getUser = async () => {
        const res = await axios.get(`${backend_url}/api/user/${id}`, {
            withCredentials: true
        });
        if (res.data.success) {
            setUser(res.data.user);
        }
    };
    useEffect(() => {
        getUser();
    }, []);
    if (!user) return <h2>Loading...</h2>;
    return (
        <div className={styles.userDetails}>
            <div className={styles.container}>
                <button
                    className={styles.back}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    Back
                </button>
                <div className={styles.card}>
                    <FaUserCircle className={styles.avatar} />
                    <h2>{user.orders[0]?.userId?.name}</h2>
                    <p>{user.orders[0]?.userId.email}</p>
                    <div className={styles.info}>
                        <div>
                            <FaShoppingBag />
                            <span>{user.orders.length} Orders</span>
                        </div>
                        <div>
                            <FaRupeeSign />
                            <span>₹{user.totalSpent}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.orders}>
                    <h3>Recent Orders</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Food</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.orders.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.items.map(i => i.name).join(", ")}</td>
                                    <td>{item.status}</td>
                                    <td>₹{item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;