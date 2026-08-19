import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import {
    FaHouse,
    FaUsers,
    FaCartShopping,
    FaLayerGroup,
    FaBoxOpen,
    FaStarHalfStroke,
    FaPercent,
    FaRightFromBracket,
} from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa"
import axios from "axios";
import { AdminContext } from "../../Context/AdminContext";
export default function Sidebar() {
    const {
        backend_url,
        setIsLogin,
        navigate,
        showSidebar,
        setShowSidebar,
    } = useContext(AdminContext);
    const logout = async () => {
        try {
            const response = await axios.post(
                `${backend_url}/api/user/adminlogout`,
                {},
                { withCredentials: true }
            );
            if (response.data.success) {
                setIsLogin(false);
                setShowSidebar(false);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            {showSidebar && (
                <div
                    className={styles.overlay}
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}
            <div
                className={`${styles.sidebar_container} ${showSidebar ? styles.showSidebar : ""
                    }`}
            >
                <div className={styles.sidebar}>
                    <NavLink
                        to="/"
                        onClick={() => setShowSidebar(false)}
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.active : ""}`
                        }
                    >
                        <FaHouse className={styles.icons} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/product"
                        onClick={() => setShowSidebar(false)}
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.active : ""}`
                        }
                    >
                        <FaBoxOpen className={styles.icons} />
                        <span>Products</span>
                    </NavLink>
                    <NavLink
                        to="/category"
                        onClick={() => setShowSidebar(false)}
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.active : ""}`
                        }
                    >
                        <FaLayerGroup className={styles.icons} />
                        <span>Categories</span>
                    </NavLink>
                    <NavLink
                        to="/orders"
                        onClick={() => setShowSidebar(false)}
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.active : ""}`
                        }
                    >
                        <FaCartShopping className={styles.icons} />
                        <span>Orders</span>
                    </NavLink>
                    <NavLink
                        to="/users"
                        onClick={() => setShowSidebar(false)}
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.active : ""}`
                        }
                    >
                        <FaUsers className={styles.icons} />
                        <span>Users</span>
                    </NavLink>
                    <NavLink to="/payments" onClick={() => setShowSidebar(false)} className={({ isActive }) =>
                        `${styles.link} ${isActive ? styles.active : ""}`
                    }>
                        <FaCreditCard />
                        <span>Payments</span>
                    </NavLink>
                    <button className={styles.logoutbtn} onClick={logout}>
                        <FaRightFromBracket className={styles.icons} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}