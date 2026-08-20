import React, { useEffect, useState } from 'react'

import axios from 'axios';
import Swal from "sweetalert2";
import { toast } from 'react-toastify'
import {
    FaMagnifyingGlass,
    FaPlus, FaArrowRight, FaChevronLeft, FaChevronRight
} from "react-icons/fa6";
import styles from './Product.module.css'
import {
    FiFolder,
    FiFolderPlus,
    FiCheckCircle,
    FiXCircle,
    FiBox,
    FiEdit2,
    FiTrash2,
    FiPackage
} from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { LuClock3 } from "react-icons/lu";
import { useContext } from 'react';
import { AdminContext } from '../../../Context/AdminContext';

function Product() {
    const [productData, setProductData] = useState([])
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("All")
    const [stock, setStock] = useState("All Stock")
    const [sortCatgeory, setSortCategory] = useState("All")
    const [category, setCategory] = useState([])
    const [totals, setTotals] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [currentPage, setCurrentPage] = useState(1)
    const itemperpage = 5
    const lastIndex = currentPage * itemperpage;
    const firstIndex = lastIndex - itemperpage
    const { navigate, backend_url } = useContext(AdminContext)
    const getProducts = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/food/list`)
            if (response.data.success) {
                setProductData(response.data.data)
                setTotals(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getCategory = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/category/list`)
            if (response.data.success) {
                setCategory(response.data.category)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => { getProducts(); getCategory(); }, [])
    const deleteItem = async (id) => {
        try {
            const response = await axios.post(`${backend_url}/api/food/delete`, { id }, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message)
                getProducts()
            } else {
                toast.error(response.data.message)
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
    const filteraProduct = productData ?
        productData.filter((item) => {
            const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
            const matchCategory = sortCatgeory === "All" ||
                item.category === sortCatgeory
            const matchStatus = status == "All" || item.status == status
            let matchStock = true;
            switch (stock) {
                case "In Stock":
                    matchStock = item.stock > 10
                    break;
                case "Low Stock":
                    matchStock = item.stock > 0 && item.stock <= 10
                    break;
                case "Out of Stock":
                    matchStock = item.stock === 0
                    break;
                case "All":
                default:
                    matchStock = true;
                    break;
            }
            return (
                matchSearch && matchCategory && matchStatus && matchStock
            );
        }) : [];
    const paginatedProducts = filteraProduct.slice(firstIndex, lastIndex)
    const totalPages = Math.ceil(filteraProduct.length / itemperpage)
    const visibleButtons = 3;
    const startPage =
        Math.floor((currentPage - 1) / visibleButtons) * visibleButtons + 1;
    const endPage = Math.min(
        startPage + visibleButtons - 1,
        totalPages
    );
    const ingredient = selectedFood?.ingredients?.[0]
        ?.split(",")
        .filter(item => item.trim() !== "");
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);
    return (
        <div className={styles.product_page}>
            <div className={styles.product_content}>
                <div className={styles.head}>
                    <div className={styles.heading}>
                        <FiFolder className={styles.icon} />
                        <h2>Products</h2>
                    </div>
                    <button onClick={() => navigate('/product/add')} className={styles.addproductbtn}>
                        <FaPlus className={styles.plusicon} />
                        Add Product
                    </button>
                </div>
                <div className={styles.top_conatiner}>
                    <div className={styles.top_card}>
                        <FiPackage className={styles.icons} />
                        <div className={styles.card_content}>
                            <h3>{totals.totalProduct}</h3>
                            <p>Total Products</p>
                        </div>
                    </div>
                    <div className={styles.top_card}>
                        <FiCheckCircle className={styles.icons} />
                        <div className={styles.card_content}>
                            <h3>{totals.activeProduct}</h3>
                            <p>Active Products</p>
                        </div>
                    </div>
                    <div className={styles.top_card}>
                        <FiXCircle className={styles.icons} />
                        <div className={styles.card_content}>
                            <h3>{totals.inactiveProduct}</h3>
                            <p>Inactive Products</p>
                        </div>
                    </div>
                    <div className={styles.top_card}>
                        < RiErrorWarningLine className={styles.icons} />
                        <div className={styles.card_content}>
                            <h3>{totals.outofstock}</h3>
                            <p>Out of Stock</p>
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
                            <div className="category">
                                <select onChange={(e) => setSortCategory(e.target.value)} value={sortCatgeory}>
                                    <option value="All">Select Category</option>
                                    {
                                        category.map((item) => (
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className={styles.status_filter}>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="All">Status:All</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className={styles.stock}>
                                <select name="" id="" value={stock} onChange={(e) => setStock(e.target.value)}>Sort By:
                                    <option value="All Stock">All Stock</option>
                                    <option value="In Stock">In Stock</option>
                                    <option value="Low Stock">Low Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className={styles.category_table}>
                        <div className={styles.thead}>
                            <p>#</p>
                            <p>IMAGE</p>
                            <p>PRODUCT NAME</p>
                            <p>CATEGORY</p>
                            <p>PRICE</p>
                            <p>OFFER_PRICE</p>
                            <p>STOCK</p>
                            <p>STATUS</p>
                            {/* <p>OREDRS</p> */}
                            <p>PREP TIME</p>
                            <p>ACTIONS</p>
                        </div>
                        {
                            paginatedProducts ? paginatedProducts.map((item, index) => (
                                < div className={styles.tbody} key={index} >
                                    <p>{(currentPage - 1) * itemperpage + index + 1}</p>
                                    <img src={item.image} alt="" className={styles.img} />
                                    <p>{item.name}</p>
                                    <p>{category.find((cat) => cat._id == item.category)?.name || ""}</p>
                                    <p>&#8377;{item.price}</p>
                                    <p className={styles.offer_price}>&#8377;{item.offer_price}</p>
                                    <p>{item.stock}</p>
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
                                    <div className={styles.time}><LuClock3 className={styles.time_icon} /><p>{item.preparationTime}</p></div>
                                    <div className={styles.action}>
                                        <button className={styles.view} onClick={() => {
                                            setSelectedFood(item);
                                            setShowModal(true);
                                        }}>
                                            <FaRegEye />
                                        </button>
                                        <button className={styles.edit} onClick={() => navigate(`/product/edit/${item._id}`)}>
                                            <FiEdit2 />
                                        </button>
                                        <button className={styles.delete} onClick={() => handleDelete(item._id)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            )) : null}
                        {showModal && (
                            <div className={styles.overlay}>
                                <div className={styles.modal}>
                                    <div className={styles.header}>
                                        <h3>View Product</h3>
                                        <button
                                            className={styles.close}
                                            onClick={() => setShowModal(false)}
                                        >
                                            ✖
                                        </button>
                                    </div>
                                    <hr />
                                    <div className={styles.single_pro}>
                                        <div className={styles.img_conatiner}>
                                            <img
                                                src={selectedFood?.image}
                                                alt=""
                                                width="200"
                                                className={styles.pro_img}
                                            />
                                        </div>
                                        <div className={styles.info}>
                                            <div className={styles.product_name}><p>Product Name: </p><h4> {selectedFood?.name}</h4></div>
                                            <div className={styles.con}>
                                                <p className={styles.sub_info}>Price: <b>₹ {selectedFood?.price}</b></p>
                                                <p className={styles.sub_info}>Category:  <b> {
                                                    category.find(
                                                        (item) => item._id === selectedFood?.category
                                                    )?.name
                                                }</b></p>
                                            </div>
                                            <div className={styles.con}>
                                                <p className={styles.sub_info}>
                                                    <p>Status: </p>
                                                    <b><p className={selectedFood.status == "Active" ? styles.status_active : styles.status_inactive}>{selectedFood?.status}</p></b>
                                                </p>
                                                <p className={styles.sub_info}><p>Stock: </p> <b>{selectedFood?.stock}</b></p>
                                            </div>
                                            <p className={styles.sub_info}> <p>PreparationTime: </p>   <div className={styles.pre_time}><b><LuClock3 />  {selectedFood.preparationTime}</b></div></p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className={styles.bottom}>
                                        <p ><p className={styles.sub_head}>Description</p> {selectedFood?.description}</p>
                                        <p><p className={styles.sub_head}>Ingredients</p>
                                            <div className={styles.ingredients}>
                                                {ingredient.map((item, index) => (
                                                    <p key={index} className={styles.ingredient_tag}>{item}</p>
                                                ))}
                                            </div></p>
                                    </div>
                                </div>
                            </div>
                        )}
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
        </div >
    )
}

export default Product
