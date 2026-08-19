import styles from "./EditProfile.module.css";
import { FaCircleUser } from "react-icons/fa6";
import { useState, useContext, useEffect } from "react";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from 'react-toastify'
import { FaEyeSlash, FaEye, FaCamera } from 'react-icons/fa'
const EditProfile = () => {
    const { userData, backend_url, setUserData, navigate, fetchUser } = useContext(StoreContext)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [image, setImage] = useState(null);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: ""
    });
    useEffect(() => {
        if (userData?.user) {
            setProfile({
                name: userData.user.name || "",
                email: userData.user.email || "",
                phone: userData.user.phoneno || ""
            });
        }
    }, [userData]);
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const profileChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };
    const passwordChange = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        });
    };
    const formData = new FormData()
    if (image) {
        formData.append("image", image)
    }
    formData.append("name", profile.name)
    formData.append("phoneno", profile.phone)
    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const responsee = await axios.put(`${backend_url}/api/user/editprofile`, formData, {
                withCredentials: true, headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            if (responsee.data.success) {
                toast.success(responsee.data.message)
                await fetchUser();
            }
        } catch (error) {
            console.log(error)
        }
    };
    for (const pair of formData.entries()) {
    } const updatePassword = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = password
        try {
            if (!currentPassword || !newPassword || !confirmPassword) {
                return toast.error("All fields are required");
            }
            if (newPassword !== confirmPassword) {
                return toast.error("New password and confirm password do not match")
            }
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                return toast.error(
                    "Password must contain uppercase, lowercase, number and special character."
                );
            }
            if (currentPassword === newPassword) {
                return toast.error("New password must be different from current password");
            }
            const response = await axios.put(`${backend_url}/api/user/edituserpassword`, { currentPassword, newPassword, confirmPassword }, { withCredentials: true })
            if (response.data.success) {
                toast.success(response.data.message)
                setUserData(null)
                await fetchUser();
                navigate("/login", {
                    state: {
                        mode: "signin"
                    }
                });
            }
        } catch (error) {
            console.log(error)
        }
    };
    return (
        <section className={styles.settings}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.profileImage}>
                        {
                            image ? <img src={URL.createObjectURL(image)} alt="profile"></img> :
                                userData?.user?.image ? <img src={userData.user.image} alt="profile" /> : <FaCircleUser className={styles.icon} />
                        }
                        <label htmlFor="profileImage">
                            <FaCamera />
                        </label>
                        <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <h2>Account Settings</h2>
                    <p>Manage your profile and password.</p>
                </div>
                <form onSubmit={updateProfile}>
                    <h3>Personal Information</h3>
                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={profileChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            disabled
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={profileChange}
                        />
                    </div>
                    <button className={styles.saveBtn} type="submit">
                        Save Changes
                    </button>
                </form>
                <hr />
                <form onSubmit={updatePassword}>
                    <h3>Change Password</h3>
                    <div className={styles.inputGroup}>
                        <label>Current Password</label>
                        <div className={styles.pass_input}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                name="currentPassword"
                                value={password.currentPassword}
                                onChange={passwordChange}
                                className={styles.input}
                            />
                            <span className={styles.eyeIcon} onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>New Password</label>
                        <div className={styles.pass_input}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                value={password.newPassword}
                                onChange={passwordChange}
                                className={styles.input}
                            />
                            <span className={styles.eyeIcon} onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Confirm Password</label>
                        <div className={styles.pass_input}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={password.confirmPassword}
                                onChange={passwordChange}
                                className={styles.input}
                            />
                            <span className={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>
                    <button className={styles.passwordBtn} type="submit">
                        Update Password
                    </button>
                </form>
            </div>
        </section>
    );
};
export default EditProfile;