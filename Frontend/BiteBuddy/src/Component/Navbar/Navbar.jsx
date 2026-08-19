import React, { useState } from 'react'
import assets from '../../assets/assets'
import { FaSearch } from "react-icons/fa";
import { FaCartShopping, FaCircleUser } from "react-icons/fa6";
import styles from './Navbar.module.css'
import { NavLink, Link } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext'
import { useContext } from 'react'
import { HiMenuAlt3 } from "react-icons/hi";
import axios from 'axios'
import { toast } from 'react-toastify'
const Navbar = () => {
    const { totalCartItem, navigate, search, setSearch, userData, backend_url, setCartData, setCartItems, setUserData } = useContext(StoreContext)
    const [showMenu, setShowMenu] = useState(false);
    const logout = async () => {
        try {
            const response = await axios.post(
                `${backend_url}/api/user/logout`,
                {},
                { withCredentials: true }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                setUserData(null);
                setCartData({});
                setCartItems([]);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className={styles.navbar_container}>
                <header className={styles.navbar}>
                    <div className={styles.logo}>
                        <h1 className={styles.main_heading}><span className={styles.orange}>Bite</span>Buddy</h1>
                    </div>
                    <div className={styles.nav_menu} >
                        <ul>
                            <li><NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}>Home</NavLink></li>
                            <li><NavLink to="/menu" className={({ isActive }) => isActive ? styles.active : ""}>Menu</NavLink></li>
                            <li><NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ""}>About Us</NavLink></li>
                            <li><NavLink to="/contact" className={({ isActive }) => isActive ? styles.active : ""}>Contact</NavLink></li>
                        </ul>
                    </div>
                    <div className={styles.right_container}>
                        <div className={styles.search}>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => navigate('/menu')}
                                type="text"
                                className={styles.searchinput}
                                placeholder="Search food..."
                            />
                            {/* Mobile only icon */}
                            <FaSearch
                                className={styles.search_icon}
                                onClick={() => setSearchOpen(!searchOpen)}
                            />
                        </div>
                        <div className={styles.cart} onClick={() => navigate('/cart')}>
                            <FaCartShopping className={styles.cart_icon} />
                            <p className={styles.cart_count}>{totalCartItem}</p>
                        </div>
                        {
                            userData ?
                                <div className={styles.profile}>
                                    {userData.user?.image ? <img src={userData.user.image} alt="Profile" /> : <FaCircleUser className={styles.profile_icon} size={29} />}
                                    <div className={styles.dropdown}>
                                        <Link to="/myprofile">My Profile</Link>
                                        <Link to="/edit-account">Account Settings</Link>
                                        <button onClick={logout}>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                                : <div className={styles.login_btn}>
                                    <button onClick={() => navigate('/login')}>Sign Up</button>
                                </div>
                        }
                        <HiMenuAlt3
                            className={styles.menu_icon}
                            onClick={() => setShowMenu(!showMenu)}
                        />
                    </div>
                </header>
                {showMenu && (
                    <div
                        className={styles.overlay}
                        onClick={() => setShowMenu(false)}
                    ></div>
                )}
                <div className={`${styles.mobile_menu} ${showMenu ? styles.open : ""}`}>
                    <span
                        className={styles.close}
                        onClick={() => setShowMenu(false)}
                    >
                        ✕
                    </span>
                    <div className={styles.menu}>
                        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""} onClick={() => setShowMenu(false)}>
                            Home
                        </NavLink>
                        <NavLink to="/menu" onClick={() => setShowMenu(false)} className={({ isActive }) => isActive ? styles.active : ""}>
                            Menu
                        </NavLink>
                        <NavLink to="/about" onClick={() => setShowMenu(false)} className={({ isActive }) => isActive ? styles.active : ""}>
                            About Us
                        </NavLink>
                        <NavLink to="/contact" onClick={() => setShowMenu(false)} className={({ isActive }) => isActive ? styles.active : ""}>
                            Contact
                        </NavLink>
                        <NavLink to="/login" onClick={() => setShowMenu(false)} className={({ isActive }) => isActive ? styles.active : ""}>
                            Login
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Navbar
