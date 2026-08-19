import React, { useContext, useEffect, useState } from "react";
import styles from "./Payments.module.css";
import axios from "axios";
import { AdminContext } from "../../Context/AdminContext";
import { FaCreditCard, FaEye, FaSearch } from "react-icons/fa";
import {
    FaCircleCheck,
    FaClock,
    FaCircleXmark
} from "react-icons/fa6";

const Payments = () => {
    const { backend_url, navigate } = useContext(AdminContext);
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState({});
    const [search, setSearch] = useState("");
    const getPayments = async () => {
        try {
            const response = await axios.get(
                `${backend_url}/api/payment/list`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setPayments(response.data.payments);
                setSummary(response.data.summary);
            }
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        getPayments();
    }, []);
    const filtered = payments.filter(item => {
        const customer = item.userId?.name || "";
        return (
            customer.toLowerCase().includes(search.toLowerCase()) ||
            item._id.includes(search)
        );
    });
    return (
        <div className={styles.page}>
            <h1>Payments</h1>
            <div className={styles.cards}>
                <div className={styles.card}>
                    <FaCreditCard className={styles.icons} />
                    <div>
                        <h2>₹{summary.totalRevenue || 0}</h2>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <FaCircleCheck className={styles.icons} />
                    <div>
                        <h2>{summary.successful || 0}</h2>
                        <p>Successful</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <FaClock className={styles.icons} />
                    <div>
                        <h2>{summary.pending || 0}</h2>
                        <p>Pending</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <FaCircleXmark className={styles.icons} />
                    <div>
                        <h2>{summary.failed || 0}</h2>
                        <p>Failed</p>
                    </div>
                </div>
            </div>
            <div className={styles.searchBox}>
                <FaSearch />
                <input
                    placeholder="Search Customer or Order"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className={styles.table_wrapper}>
                <table className={styles.paymentTable}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.userId?.name}</td>
                                <td>₹{item.amount}</td>
                                <td>{item.paymentMethod}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {item.payment
                                        ? "Success"
                                        : item.cancelled
                                            ? "Failed"
                                            : "Pending"}
                                </td>
                                <td>
                                    <button className={styles.view}
                                        onClick={() => navigate(`/payments/${item._id}`)}
                                    >
                                        <FaEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payments;