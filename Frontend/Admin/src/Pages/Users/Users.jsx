import React, { useContext, useEffect, useState } from "react";
import styles from "./Users.module.css";
import axios from "axios";
import { AdminContext } from "../../Context/AdminContext";
import {
    FaUsers,
    FaCartPlus,
    FaShoppingBag,
    FaSearch,
    FaEye,
    FaTrash
} from "react-icons/fa";
import { toast } from "react-toastify";


const Users = () => {
    const { backend_url, navigate } = useContext(AdminContext);
    const [userData, setUserData] = useState([]);
    const [search, setSearch] = useState("")
    const userperpage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const getUsers = async () => {
        try {
            const response = await axios.get(
                `${backend_url}/api/user/list`,
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setUserData(response.data.users);
                setCurrentPage(1);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getUsers();
    }, []);
    const users = userData.user || []
    const filterData = users.filter((user) => {
        if (!search) return true
        return (
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()))
    })
    const totalPages = Math.ceil(filterData.length / userperpage);
    const lastIndex = currentPage * userperpage
    const firstIndex = lastIndex - userperpage
    const userpage = filterData.slice(firstIndex, lastIndex)
    const visibleButtons = 3;
    const startPage =
        Math.floor((currentPage - 1) / visibleButtons) * visibleButtons + 1;
    const endPage = Math.min(
        startPage + visibleButtons - 1,
        totalPages
    );
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${backend_url}/api/user/deleteuser`, { data: { id }, withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
                await getUsers()
                setCurrentPage(1);
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className={styles.users}>
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>
                            <FaUsers />
                            Users
                        </h1>
                        <p>Manage all registered users</p>
                    </div>
                </div>
                {/* Cards */}
                <div className={styles.cards}>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <FaUsers />
                        </div>
                        <div>
                            <h2>{users.length}</h2>
                            <p>Total Users</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.iconGreen}>
                            <FaCartPlus />
                        </div>
                        <div>
                            <h2>{userData.orderedUsers}</h2>
                            <p>Customers</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.iconOrange}>
                            <FaShoppingBag />
                        </div>
                        <div>
                            <h2>
                                {users.reduce(
                                    (total, user) => total + (user.totalOrders || 0),
                                    0
                                )}
                            </h2>
                            <p>Total Orders</p>
                        </div>
                    </div>
                </div>
                {/* Search */}
                <div className={styles.searchBox}>
                    <FaSearch />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                    />
                </div>
                {/* Table */}
                <div className={styles.tableBox}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Orders</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userpage.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{(currentPage - 1) * userperpage + index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.totalOrders || 0}</td>
                                        <td>
                                            {
                                                user.createdAt?.slice(0, 10)
                                            }
                                        </td>
                                        <td className={styles.actionbtn}>
                                            <button className={styles.view} onClick={() => navigate(`/userdetails/${user._id}`)}>
                                                <FaEye />
                                            </button>
                                            <button className={styles.delete} onClick={() => handleDelete(user._id)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {
                totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>
                        {
                            Array.from(
                                { length: endPage - startPage + 1 },
                                (_, index) => {
                                    const page = startPage + index;
                                    return (
                                        <button
                                            key={page}
                                            className={
                                                currentPage === page
                                                    ? styles.activePage
                                                    : ""
                                            }
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                            )
                        }
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default Users;