import React, { useContext, useState, useEffect } from "react";
import styles from "./Login.module.css";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
const Login = () => {
    const [currentState, setCurrentState] = useState("Sign Up")
    const navigate = useNavigate();
    const { setShowLoginModal, fetchCart, fetchUser } = useContext(StoreContext)
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const location = useLocation()
    useEffect(() => {
        if (location.state?.mode === "signin") {
            setCurrentState("Sign In");
        }
    }, [location.state]);
    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentState === "Sign In") {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, { email: data.email, password: data.password }, {
                    withCredentials: true
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    await fetchUser();
                    await fetchCart();
                    navigate('/')
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            }
        }
        else {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/registetion`, { name: data.name, email: data.email, password: data.password }, {
                    withCredentials: true
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    await fetchUser();
                    await fetchCart();
                    navigate('/')
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    }
    return (
        <section className={styles.login}>
            <div className={styles.login_box}>
                {
                    currentState == "Sign In" ?
                        <div>
                            <h1>Welcome Back </h1>
                            <p>Login to continue ordering your favorite food.</p>
                        </div> :
                        <div>
                            <h1>Create Your Account </h1>
                            <p>Join BiteBuddy and start ordering your favorite meals.</p>
                        </div>
                }
                <form onSubmit={handleSubmit}>
                    {
                        currentState == "Sign Up" ?
                            <div className={styles.input_box}>
                                <FaUser className={styles.icon} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="User Name"
                                    value={data.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div> : ""
                    }
                    <div className={styles.input_box}>
                        <FaEnvelope className={styles.icon} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={data.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.input_box}>
                        <FaLock className={styles.icon} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className={styles.eyeIcon}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                    <div className={styles.option}>
                        <label>
                            <input type="checkbox" /> Remember Me
                        </label>
                        <span>Forgot Password?</span>
                    </div>
                    {
                        currentState == "Sign In" ? <button className={styles.btn} type="submit">
                            Login
                        </button> : <button className={styles.btn} type="submit">
                            Create Account
                        </button>
                    }
                </form>
                <div className={styles.bottom} >
                    {
                        currentState === "Sign Up" ? <div onClick={() => setCurrentState("Sign In")}> Already have an account?<span>Sign In</span></div>
                            : <div onClick={() => setCurrentState("Sign Up")}>Don't have an account?<span >Sign Up</span></div>
                    }
                </div>
            </div>
        </section>
    );
};
export default Login;