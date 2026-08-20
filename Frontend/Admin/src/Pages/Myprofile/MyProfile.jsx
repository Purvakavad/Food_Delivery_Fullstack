import React, { useContext, useEffect } from "react";
import styles from "./MyProfile.module.css";
import {
    FaUserShield,
    FaEnvelope,
    FaUser,
    FaCalendarAlt,
    FaEdit,
    FaLock,
} from "react-icons/fa";
import { AdminContext } from "../../Context/AdminContext";

const AdminProfile = () => {
    const { adminData, navigate, getAdminInfo } = useContext(AdminContext);
    useEffect(() => { getAdminInfo() }, [])
    return (
        <section className={styles.profile}>
            <div className={styles.card}>
                <div className={styles.top}>
                    {
                        adminData.image ? <div className={styles.avatar}><img src={adminData.image} alt="" /></div>
                            : <div className={styles.avatar}>
                                <FaUserShield />
                            </div>
                    }
                    <div>
                        <h2>{adminData?.name}</h2>
                        <p>Administrator</p>
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.item}>
                        <FaUser className={styles.icon} />
                        <div>
                            <span>Full Name</span>
                            <h4>{adminData?.name}</h4>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <FaEnvelope className={styles.icon} />
                        <div>
                            <span>Email</span>
                            <h4>{adminData?.email}</h4>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <FaUserShield className={styles.icon} />
                        <div>
                            <span>Role</span>
                            <h4>Administrator</h4>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <FaCalendarAlt className={styles.icon} />
                        <div>
                            <span>Joined</span>
                            <h4>
                                {adminData?.createdAt
                                    ? new Date(adminData.createdAt).toLocaleDateString()
                                    : "-"}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => navigate('/edit-account')}>
                        <FaEdit /> Edit Profile
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AdminProfile;