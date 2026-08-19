import React, { useState, useEffect, useRef } from 'react'
import styles from './Navbar.module.css'
import { AdminContext } from '../../Context/AdminContext'
import { useContext } from 'react'
import { FaCircleUser } from 'react-icons/fa6';
import { Link } from 'react-router-dom'
import axios from 'axios'
import { IoClose } from "react-icons/io5";
import { FaBell, FaSearch, FaBars, FaUtensils, FaUsers, FaUser, FaShoppingBag } from "react-icons/fa";
export default function Navbar() {
    const { showSidebar, setShowSidebar, isLogin, setIsLogin, backend_url, navigate, adminData } = useContext(AdminContext)
    const [showSearch, setShowSearch] = useState(false)
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [search, setSearch] = useState("");
    const notificationRef = useRef(null);
    const [results, setResults] = useState({
        products: [],
        users: [],
        orders: []
    });
    const [showResults, setShowResults] = useState(false);
    const logout = async () => {
        try {
            const response = await axios.post(`${backend_url}/api/user/adminlogout`, {}, { withCredentials: true })
            if (response.data.success) {
                setIsLogin(false);
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getNotifications = async () => {
        try {
            const response = await axios.get(
                `${backend_url}/api/user/notifications`,
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearch(value);
        if (!value.trim()) {
            setResults({
                products: [],
                users: [],
                orders: []
            });
            setShowResults(false);
            return;
        }
        try {
            const response = await axios.get(
                `${backend_url}/api/user/search`,
                {
                    params: {
                        query: value.trim()
                    },
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setResults({
                    products: response.data.products || [],
                    users: response.data.users || [],
                    orders: response.data.orders || []
                });
                setShowResults(true);
            } else {
                setResults({
                    products: [],
                    users: [],
                    orders: []
                });
                setShowResults(true);
            }
        } catch (error) {
            setResults({
                products: [],
                users: [],
                orders: []
            });
            setShowResults(true);
        }
    };
    useEffect(() => {
        getNotifications();
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className={styles.navbar_container}>
            <header className={styles.navbar}>
                <FaBars
                    className={styles.menu}
                    onClick={() => setShowSidebar(true)}
                />
                <div className={styles.logo}>
                    <h1 className={styles.main_heading}>
                        <span className={styles.orange}>Bite</span>Buddy
                    </h1>
                    <span className={styles.admin_text}>ADMIN PANEL</span>
                </div>
                <div className={styles.right}>
                    <div className={`${styles.searchWrapper} ${showSearch ? styles.searchOpen : ""}`}>
                        <div className={styles.searchBox}>
                            <FaSearch
                                className={styles.searchIcon}
                                onClick={() => {
                                    setShowSearch(prev => !prev);
                                    setShowResults(false);
                                    setSearch("");
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Search products, users, orders..."
                                value={search}
                                onChange={handleSearch}
                                className={`${styles.search} ${showSearch ? styles.searchinput : ""}`}
                            />
                            {search && (
                                <button
                                    className={styles.clearSearch}
                                    onClick={() => {
                                        setSearch("");
                                        setShowResults(false);
                                    }}
                                >
                                    <IoClose />
                                </button>
                            )}
                        </div>
                        {showResults && (
                            <div className={styles.searchResults}>
                                {/* PRODUCTS */}
                                {results.products.length > 0 && (
                                    <div className={styles.searchSection}>
                                        <h4>
                                            <FaUtensils />
                                            Products
                                        </h4>
                                        {results.products.map((product) => (
                                            <div
                                                className={styles.resultItem}
                                                key={product._id}
                                                onClick={() => {
                                                    navigate("/product"); setSearch("");
                                                    setShowResults(false);
                                                }}
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                />
                                                <div className={styles.resultInfo}>
                                                    <strong>
                                                        {product.name}
                                                    </strong>
                                                    <span>
                                                        ₹{product.offer_price || product.price}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* USERS */}
                                {results.users.length > 0 && (
                                    <div className={styles.searchSection} onClick={() => {
                                        navigate("/users"); setSearch("");
                                        setShowResults(false);
                                    }}>
                                        <h4>
                                            <FaUsers />
                                            Users
                                        </h4>
                                        {results.users.map((user) => (
                                            <div
                                                className={styles.resultItem}
                                                key={user._id}
                                            >
                                                <div className={styles.userIcon}>
                                                    <FaUser />
                                                </div>
                                                <div className={styles.resultInfo}>
                                                    <strong>
                                                        {user.name}
                                                    </strong>
                                                    <span>
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* ORDERS */}
                                {results.orders.length > 0 && (
                                    <div className={styles.searchSection} onClick={() => {
                                        navigate("/orders"); setSearch("");
                                        setShowResults(false);
                                    }}>
                                        <h4>
                                            <FaShoppingBag />
                                            Orders
                                        </h4>
                                        {results.orders.map((order) => (
                                            <div
                                                className={styles.resultItem}
                                                key={order._id}
                                            >
                                                <div className={styles.orderIcon}>
                                                    <FaShoppingBag />
                                                </div>
                                                <div className={styles.resultInfo}>
                                                    <strong>
                                                        Order #{order._id.slice(-6)}
                                                    </strong>
                                                    <span>
                                                        {order.userId?.name || "Unknown User"}
                                                    </span>
                                                    <small>
                                                        {order.status}
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* NO RESULT */}
                                {results.products.length === 0 &&
                                    results.users.length === 0 &&
                                    results.orders.length === 0 && (
                                        <div className={styles.noResults}>
                                            <FaSearch />
                                            <p>No results found</p>
                                            <span>
                                                Try another product, user or order
                                            </span>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                    <div className={styles.notificationWrapper} ref={notificationRef}>
                        <div
                            className={styles.notificationBell}
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <FaBell className={styles.notificationsIcon} />
                            {notifications.length > 0 && (
                                <span className={styles.notificationCount}>
                                    {notifications.length}
                                </span>
                            )}
                        </div>
                        {showNotifications && (
                            <div className={styles.notificationDropdown} >
                                <div className={styles.notificationHeader}>
                                    <h3>Notifications</h3>
                                    <span>{notifications.length} New</span>
                                </div>
                                <div className={styles.notificationList}>
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div
                                                className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ""}`}
                                                key={notification._id}
                                            >
                                                <div className={styles.notificationIcon}>
                                                    <FaBell />
                                                </div>
                                                <div className={styles.notificationContent}>
                                                    <h4>
                                                        {notification.title}
                                                    </h4>
                                                    <p>
                                                        {notification.message}
                                                    </p>
                                                    <span className={styles.notificationTime}>
                                                        {notification.createdAt}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noNotification}>
                                            <FaBell />
                                            <p>No notifications yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.profile}>
                        {
                            isLogin &&
                                adminData?.image ? <div className={styles.profile}><img src={adminData.image} alt="profile" className={styles.profile_img} /></div>
                                : <div className={styles.profile}>
                                    <FaCircleUser className={styles.profile_icon} size={30} />
                                </div>
                        }
                        <div className={styles.dropdown}>
                            <Link to="/myprofile">My Profile</Link>
                            <Link to="/edit-account">Account Settings</Link>
                            <button onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}
