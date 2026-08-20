import React, {
    useState, useEffect
} from "react";
import styles from "./AccountSetting.module.css";
import { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaUserShield, FaCamera } from 'react-icons/fa'
const AccountSetting = () => {
    const { adminData, backend_url, navigate, getAdminInfo, setIsLogin } = useContext(AdminContext);
    const [image, setImage] = useState(null)
    const [profile, setProfile] = useState({
        name: "",
        email: ""
    });
    useEffect(() => {
        if (adminData) {
            setProfile({
                name: adminData.name || "",
                email: adminData.email || ""
            });
        }
    }, [adminData]);
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const formData = new FormData()
    formData.append("name", profile.name)
    formData.append("email", profile.email)
    formData.append("image", image)
    const handleProfileChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };
    const handlePasswordChange = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        });
    };
    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${backend_url}/api/user/editadminprofile`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } })
            if (response.data.success) {
                toast.success(response.data.message)
                await getAdminInfo()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };
    const updatePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${backend_url}/api/user/editadminpwd`, { currentPassword: password.currentPassword, newPassword: password.newPassword, confirmPassword: password.confirmPassword }, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                setIsLogin(false)
                navigate('/login')
                await getAdminInfo()
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };
    return (
        <section className={styles.setting}>
            <div className={styles.card}>
                <h2>Account Settings</h2>
                <div className={styles.container}>
                    {/* Profile */}
                    <form onSubmit={updateProfile} className={styles.box}>
                        <h3>Edit Profile</h3>
                        <div className={styles.inputGroup}>
                            <label>Profile Picture</label>
                            <label className={styles.profile} htmlFor="profile">
                                {
                                    image ? (<>
                                        <img src={URL.createObjectURL(image)} alt="profile"></img>
                                        <span className={styles.cameraicon}>
                                            <FaCamera className={styles.icon} />
                                        </span></>) :
                                        adminData.image ? (<>
                                            <img src={adminData.image}></img>
                                            <span className={styles.cameraicon}>
                                                <FaCamera className={styles.icon} />
                                            </span></>)
                                            : (<><span className={styles.avatar}>
                                                <FaUserShield />
                                            </span>
                                                <span className={styles.cameraicon}>
                                                    <FaCamera className={styles.icon} />
                                                </span></>)
                                }
                            </label>
                            <input type="file" hidden id="profile" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                            />
                        </div>
                        <button type="submit">
                            Save Changes
                        </button>
                    </form>
                    {/* Password */}
                    <form onSubmit={updatePassword} className={styles.box}>
                        <h3>Change Password</h3>
                        <div className={styles.inputGroup}>
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={password.currentPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={password.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={password.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <button type="submit">
                            Update Password
                        </button>
                    </form>
                </div>
            </div >
        </section >
    );
};
export default AccountSetting;