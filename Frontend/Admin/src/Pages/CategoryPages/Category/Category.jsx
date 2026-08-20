import React, { useContext, useEffect, useState } from 'react'
import assets from '../../../assets/assets'
import styles from './Category.module.css'
import axios from 'axios';
import Swal from "sweetalert2";
import { toast } from 'react-toastify'
import {
    FaMagnifyingGlass,
    FaPlus, FaArrowRight, FaChevronLeft, FaChevronRight,
    FaEye
} from "react-icons/fa6";
import {
    FiFolder,
    FiFolderPlus,
    FiCheckCircle,
    FiXCircle,
    FiBox,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";
import { AdminContext } from '../../../Context/AdminContext';
export default function Category() {
    const { navigate, backend_url } = useContext(AdminContext)
    const [listCategory, setListCatgeory] = useState()
    const [totals, setTotals] = useState([])
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("All")
    const [sortBy, setSortBy] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [singleCategory, setSingleCategory] = useState({})
    const [showModal, setShowModal] = useState(false);
    const getCategory = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/category/list`)
            if (response.data.success) {
                setListCatgeory(response.data.category)
                setTotals(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getCategory()
    }, [])
    const deleteItem = async (id) => {
        try {
            const respons = await axios.post(`${backend_url}/api/category/delete`, { id }, { withCredentials: true })
            if (respons.data.success) {
                toast.success(respons.data.message)
                getCategory()
            } else {
                toast.error(respons.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to recover this category!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
            deleteItem(id);
        }
    };
    const filterCategory = listCategory ?
        listCategory.filter((item) => {
            const matchSearch = item.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
                item.slug.toLowerCase().includes(search.toLowerCase());
            const matchStatus = status === "All" || status === item.status
            return matchSearch && matchStatus
        }).sort((a, b) => {
            switch (sortBy) {
                case "Newest":
                    return new Date(b.createdAt) - new Date(a.createdAt)
                case "Oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt)
                case "Z-A":
                    return b.name.localeCompare(a.name)
                case "A-Z":
                    return a.name.localeCompare(b.name)
                default:
                    return 0
            }
        }) : [];
    const itemperpage = 5
    const lastIndex = currentPage * itemperpage
    const firstIndex = lastIndex - itemperpage
    const currentCategory = filterCategory.slice(firstIndex, lastIndex)
    const totalPages = Math.ceil(filterCategory.length / itemperpage)
    const visibleButtons = 3;
    const startPage =
        Math.floor((currentPage - 1) / visibleButtons) * visibleButtons + 1;
    const endPage = Math.min(
        startPage + visibleButtons - 1,
        totalPages
    );
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);
    const showCategory = async (id) => {
        try {
            const response = await axios.get(
                `${backend_url}/api/category/${id}`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setSingleCategory(response.data.category);
                setShowModal(true);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load category");
        }
    };
    return (
        <div className={styles.category_page}>
            <div className={styles.category_content}>
                <div className={styles.head}>
                    <div className={styles.heading}>
                        <FiFolder className={styles.icon} />
                        <h2>Categories</h2>
                    </div><button onClick={() => navigate('/addCategory')} className={styles.addcategorybtn}>
                        <FaPlus />
                        Add Category
                    </button>
                </div>
                <div className={styles.top_conatiner}>
                    <div className={styles.top_card}>
                        <FiFolderPlus className={styles.icons} />
                        <div className={styles.card_content}>
                            <h3>{totals.totalCategory}</h3>
                            <p>Total Categories</p>
                        </div>
                    </div>
                    <div className={styles.top_card}>
                        <FiCheckCircle className={styles.icons} />
                        <div className={styles.card_content}>
                            <h3>{totals.activeCategory}</h3>
                            <p>Active Categories</p>
                        </div>
                    </div>
                    <div className={styles.top_card}>
                        <FiXCircle className={styles.icons} />
                        <div className={styles.card_content}>
                            <h3>{totals.inactiveCategory}</h3>
                            <p>Inactive Categories</p>
                        </div>
                    </div>
                    <div className={styles.top_card}>
                        <FiBox className={styles.icons} />
                        <div className={styles.card_content}>
                            <h3>{totals.totalProduct}</h3>
                            <p>Total Products</p>
                        </div>
                    </div >
                </div >
                <div className={styles.bottom_conatiner}>
                    <div className={styles.top_bar}>
                        <div className={styles.search}>
                            <FaMagnifyingGlass className={styles.search_icon} />
                            <input type="text" placeholder='Search categories...' value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className={styles.sorting}>
                            <div className={styles.status}>
                                <select name="" id="" value={status} onChange={(e) => setStatus(e.target.value)}>Status:
                                    <option value="All">All</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className={styles.news}>
                                <select name="" id="" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>Sort By:
                                    <option value="Newest">Newest First</option>
                                    <option value="Oldest">Oldest First</option>
                                    <option value="A-Z">A → Z</option>
                                    <option value="Z-A">Z → A</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className={styles.category_table}>
                        <div className={styles.thead}>
                            <p>#</p>
                            <p>IMAGE</p>
                            <p>CATEGORY NAME</p>
                            <p>SLUG</p>
                            <p>DESCRIPTION</p>
                            <p>PRODUCTS</p>
                            <p>STATUS</p>
                            <p>OREDRS</p>
                            <p>CREATED AT</p>
                            <p>ACTIONS</p>
                        </div>
                        {
                            currentCategory ? currentCategory.map((item, index) => (
                                < div className={styles.tbody} >
                                    <p>{(currentPage - 1) * itemperpage + index + 1}</p>
                                    <img src={item.image} alt="" className={styles.img} />
                                    <p>{item.name}</p>
                                    <p>{item.slug}</p>
                                    <p className={styles.description}>{item.description}</p>
                                    <p>{item.productCount}</p>
                                    <p
                                        className={
                                            item.status === "Active"
                                                ?
                                                styles.active
                                                :
                                                styles.inactive
                                        }
                                    >
                                        {item.status}
                                    </p>
                                    <p>{item.orders}</p>
                                    <p>{item.createdAt.split("T")[0]}</p>
                                    <div className={styles.action}>
                                        <button className={styles.view} onClick={() => showCategory(item._id)}>
                                            <FaEye />
                                        </button>
                                        <button className={styles.edit} onClick={() => navigate(`/category/edit/${item._id}`)}>
                                            <FiEdit2 />
                                        </button>
                                        <button className={styles.delete} onClick={() => handleDelete(item._id)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            )) : null}
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
                </div>
            </div >
            {showModal && singleCategory && (
                <div className={styles.modalOverlay}>
                    <div className={styles.categoryModal}>
                        <div className={styles.modalHeader}>
                            <h2>Category Details</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.categoryImageBox}>
                                <img
                                    src={singleCategory.image}
                                    alt={singleCategory.name}
                                />
                            </div>
                            <div className={styles.categoryDetails}>
                                <div className={styles.detailItem}>
                                    <span>Category Name</span>
                                    <strong>{singleCategory.name}</strong>
                                </div>
                                <div className={styles.detailItem}>
                                    <span>Slug</span>
                                    <strong>{singleCategory.slug}</strong>
                                </div>
                                <div className={styles.detailItem}>
                                    <span>Description</span>
                                    <strong>
                                        {singleCategory.description || "No description"}
                                    </strong>
                                </div>
                                <div className={styles.detailItem}>
                                    <span>Status</span>
                                    <strong>{singleCategory.status}</strong>
                                </div>
                                <div className={styles.detailItem}>
                                    <span>Products</span>
                                    <strong>
                                        {singleCategory.productCount ?? 0}
                                    </strong>
                                </div>
                                <div className={styles.detailItem}>
                                    <span>Orders</span>
                                    <strong>
                                        {singleCategory.orders ?? 0}
                                    </strong>
                                </div>
                                <div className={styles.detailItem}>
                                    <span>Created At</span>
                                    <strong>
                                        {singleCategory.createdAt
                                            ? singleCategory.createdAt.split("T")[0]
                                            : "N/A"}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}
