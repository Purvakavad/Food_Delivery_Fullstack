import { useContext, useEffect } from "react";
import styles from "./MyProfile.module.css";
import { FaBoxOpen, FaShoppingCart, FaCalendarAlt } from "react-icons/fa";
import { FaCircleUser } from 'react-icons/fa6'
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
const MyProfile = () => {
    const { navigate, userData, fetchUser, totalCartItem } = useContext(StoreContext);
    useEffect(() => { fetchUser() }, [])
    return (
        <section className={styles.profile}>
            <div className={styles.card}>
                <div className={styles.header}>
                    {userData?.user.image ? <img src={userData.user.image} alt="profile image" className={styles.profileImg} /> : <FaCircleUser className={styles.profileIcon} />}
                    <h2>{userData?.user?.name}</h2>
                    <p>{userData?.user?.email}</p>
                    <p>+91 9876543210</p>
                    <button
                        className={styles.editBtn}
                        onClick={() => navigate("/edit-account")}
                    >
                        Edit Profile
                    </button>
                </div>
                <div className={styles.stats}>
                    <div className={styles.box}>
                        <FaBoxOpen />
                        <h3>{userData.totalOrders}</h3>
                        <span>Total Orders</span>
                    </div>
                    <div className={styles.box}>
                        <FaShoppingCart />
                        <h3>{totalCartItem}</h3>
                        <span>Cart Items</span>
                    </div>
                    <div className={styles.box}>
                        <FaCalendarAlt />
                        <h3>{new Date(userData.user?.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}</h3>
                        <span>Member Since</span>
                    </div>
                </div>
                <div className={styles.recentOrders}>
                    <h3>Recent Orders</h3>
                    {
                        userData.recentOrders?.map((item, index) => (
                            <div className={styles.order} key={index}>
                                <div className={styles.product_info}>
                                    {item.items.map((i, index) => (
                                        <div className={styles.product_img} key={index}>
                                            <img src={i.image}></img>
                                            <span>
                                                {i.name}
                                                {index < item.items.length - 1 && ", "}
                                            </span>
                                        </div>
                                    )
                                    )
                                    }
                                </div>
                                <div>
                                    <span className={styles.delivered}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};
export default MyProfile;