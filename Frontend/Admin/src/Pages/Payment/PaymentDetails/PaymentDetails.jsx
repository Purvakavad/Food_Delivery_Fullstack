import React, { useContext, useEffect, useState } from "react";
import styles from "./PaymentDetails.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../../../Context/AdminContext";

const PaymentDetails = () => {
    const { id } = useParams();
    const { backend_url } = useContext(AdminContext);
    const [payment, setPayment] = useState(null);
    const fetchData = async () => {
        const response = await axios.get(
            backend_url + "/api/payment/" + id,
            { withCredentials: true }
        );
        if (response.data.success)
            setPayment(response.data.payment);
    };
    useEffect(() => {
        fetchData();
    }, []);
    if (!payment) return <p>Loading...</p>;
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1>Payment Details</h1>
                <div className={styles.row}>
                    <span>Customer</span>
                    <b>{payment.userId?.name}</b>
                </div>
                <div className={styles.row}>
                    <span>Email</span>
                    <b>{payment.userId?.email}</b>
                </div>
                <div className={styles.row}>
                    <span>Amount</span>
                    <b>₹{payment.amount}</b>
                </div>
                <div className={styles.row}>
                    <span>Payment Method</span>
                    <b>{payment.paymentMethod}</b>
                </div>
                <div className={styles.row}>
                    <span>Status</span>
                    <b>{payment.payment ? "Successful" : "Pending"}</b>
                </div>
                <div className={styles.row}>
                    <span>Date</span>
                    <b>{new Date(payment.createdAt).toLocaleString()}</b>
                </div>
                <h3>Order Items</h3>
                {payment.items.map((item, index) => (
                    <div
                        className={styles.item}
                        key={index}
                    >
                        {item.name} × {item.quantity}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentDetails;