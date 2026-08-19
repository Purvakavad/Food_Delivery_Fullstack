import React, { useContext, useEffect } from 'react'
import styles from './Menu.module.css'
import { FaChevronRight } from "react-icons/fa";
import { FaAngleRight, FaStar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { FiFilter, FiClock } from "react-icons/fi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import { StoreContext } from '../../Context/StoreContext';
import { useLocation, useParams } from 'react-router-dom';
export default function Menu() {
    const [sortCategory, setSortCategory] = useState("All")
    const [sortPrice, setSortPrice] = useState([0, 500])
    const [sortType, setSortType] = useState("")
    const { category, foods, backend_url, cartData, search, setSearch, setCartData, getCartItem, decrement, increment, addToCart, navigate, showLoginModal, setShowLoginModal } = useContext(StoreContext)
    const [showFilter, setShowFilter] = useState(false);
    const location = useLocation()
    const filterProduct = foods
        ? foods.filter((item) => {
            const searchText = search.toLowerCase().trim();
            const productName = item.name
                .toLowerCase()
                .includes(searchText);
            const categoryData = category.find(
                (cat) => cat._id === item.category
            );
            const categoryName = categoryData?.name
                ?.toLowerCase()
                .includes(searchText);
            const categoryy =
                sortCategory === "All" ||
                item.category === sortCategory;
            const price =
                item.offer_price >= sortPrice[0] &&
                item.offer_price <= sortPrice[1];
            const type =
                sortType === "" ||
                item.tag === sortType;
            return (
                (productName || categoryName) &&
                price &&
                categoryy &&
                type
            );
        })
        : [];
    const clearFilters = () => {
        setSortCategory("All")
        setSortPrice([0, 500])
    }
    useEffect(() => {
        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: true,
            offset: 80,
            delay: 0,
        });
    }, []);
    return (
        <>
            <div className={styles.manu_page}>
                <div className={styles.main_section}>
                    <div className={`${styles.sidebar}  ${showFilter ? styles.show_sidebar : ""
                        }`} >
                        <div className={styles.top}>
                            <div className={styles.heading}>
                                <FiFilter /> <h3> Filters</h3>
                            </div>
                            <button className={`${showFilter ? styles.hidee : ""}`} onClick={clearFilters}>Clear All</button>
                            <button
                                className={styles.close_btn}
                                onClick={() => setShowFilter(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <hr />
                        <div className={styles.center}>
                            <div className={styles.catgory}>
                                <h3>Category</h3>
                                <div className={styles.categorys}>
                                    <label>
                                        <input type="radio" name="category" value="All"
                                            onChange={(e) => setSortCategory(e.target.value)} checked={sortCategory === "All"} />
                                        All Categories
                                    </label>
                                    {
                                        category && category.map((item) => (
                                            <label>
                                                <input type="radio" name="category" value={item._id}
                                                    onChange={(e) => setSortCategory(e.target.value)} checked={sortCategory === item._id} />
                                                {item.name}
                                            </label>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className={styles.price}>
                                <h3>Price Range</h3>
                                <Slider
                                    range
                                    min={0}
                                    max={500}
                                    defaultValue={[0, 500]}
                                    value={sortPrice}
                                    onChange={setSortPrice}
                                />
                                <div className={styles.price_range}>
                                    <span>&#8377;{sortPrice[0]}</span>
                                    <span>&#8377;{sortPrice[1]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        showFilter && (
                            <div
                                className={styles.overlay}
                                onClick={() => setShowFilter(false)}
                            ></div>
                        )
                    }
                    <div className={styles.mobile_filter}>
                        <button onClick={() => setShowFilter(true)}>
                            <FiFilter />
                            Filters
                        </button>
                    </div>
                    <div className={styles.products}>
                        <div className={styles.poroduct_conatiner}>
                            <div className={styles.products_cards} data-aos="fade-left">
                                {
                                    filterProduct && filterProduct.map((item, index) => (
                                        <div className={styles.card} data-aos="fade-up"
                                            data-aos-delay={index * 70} onClick={() => navigate(`/singleproduct/${item._id}`)}>
                                            <div className={styles.productImage}>
                                                <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                                                {item.stock === 0 && (
                                                    <span className={styles.outOfStockBadge}>
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </div>
                                            <div className={styles.card_content}>
                                                <h3>{item.name}</h3>
                                                <div className={styles.container}>
                                                    <div className={styles.rating}>
                                                        <FaStar className={styles.start_icon} />
                                                        <p>{item.rating}</p>
                                                    </div>
                                                    <div className={styles.time}>
                                                        <FiClock className={styles.time_icon} />   <p>{item.preparationTime}</p>
                                                    </div>
                                                </div>
                                                <div className={styles.bottom}>
                                                    <div className={styles.price}>
                                                        <span className={styles.offer}>&#8377;{item.offer_price}</span>
                                                        <span className={styles.original}>&#8377;{item.price}</span>
                                                    </div>
                                                    {
                                                        cartData[item._id] ?
                                                            <div className={styles.cart_product} onClick={(e) => { e.stopPropagation(); }}>
                                                                <button onClick={(e) => { increment(item._id) }}>+</button>
                                                                <p>{cartData[item._id]}</p>
                                                                <button onClick={(e) => { decrement(item._id) }}>-</button>
                                                            </div> :
                                                            <button className={styles.addtocart} onClick={(e) => { e.stopPropagation(); addToCart(item._id); }} >Add</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                showLoginModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>Login Required</h2>
                            <p>
                                Please login to add items to your cart.
                            </p>
                            <div className={styles.modalButtons}>
                                <button
                                    className={styles.loginBtn}
                                    onClick={() => { setShowLoginModal(false); navigate("/login") }}
                                >
                                    Login
                                </button>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowLoginModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
