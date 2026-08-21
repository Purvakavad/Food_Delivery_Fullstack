import React, { useState } from "react";
import styles from "./Login.module.css";
import { FaEnvelope, FaLock, FaUser, FaEyeSlash, FaEye } from "react-icons/fa";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";

const Login = () => {
    const { isLogin, setIsLogin, backend_url, navigate } = useContext(AdminContext)
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backend_url}/api/user/adminlogin`, { email: data.email, password: data.password }, {
                withCredentials: true,
            });
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/')
                setIsLogin(true)
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }
    return (
        <section className={styles.login}>
            <div className={styles.login_box}>
                <div>
                    <h1>Welcome Back </h1>
                    <p>Login to access your BiteBuddy Admin Panel.</p>
                </div>
                <form onSubmit={handleSubmit}>
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
                        <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                    <div className={styles.option}>
                        <label>
                            <input type="checkbox" /> Remember Me
                        </label>
                        <span>Forgot Password?</span>
                    </div>
                    <button type="submit" className={styles.submitbtn}>
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
};


export default Login;