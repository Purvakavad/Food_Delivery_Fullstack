import React, { useContext, useEffect, useState } from 'react'
import { FaAward, FaTruckFast, FaShieldHalved } from "react-icons/fa6";
import styles from './Home.module.css'
import { FaMotorcycle, FaListUl, FaStar } from 'react-icons/fa';
import { FiTruck, FiCreditCard } from "react-icons/fi";
import { FaLeaf, FaMedal, FaHamburger } from "react-icons/fa";
import WhyChoose from '../../Component/WhyChoose/WhyChoose';
import { StoreContext } from '../../Context/StoreContext';
import AOS from "aos";
import "aos/dist/aos.css";
export const Home = () => {
    const { foods, category, backend_url, cartData, decrement, increment, addToCart, navigate } = useContext(StoreContext)
    const popularCategory = category
        .filter((category) => category.featured)
        .slice(0, 6);
    const dishes = foods.slice(0, 5)
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
        <div className={styles.home_page}>
            <div className={styles.hero_conteiner}>
                <div className={styles.hero_content}>
                    <h4 className={styles.hero_heading}>Delicious Food, <br /><span className={styles.orange}>Delivered</span> Fast!</h4>
                    <p className={styles.content}>Enjoy your favorite meals from our kitchen <br /> delivered hot and fresh to your doorstep.</p>
                    <div className={styles.btns}>
                        <div className={styles.order_btn} onClick={() => navigate('/menu')}>
                            <FaMotorcycle /><button>Order Now</button>
                        </div>
                        <div className={styles.menu_btn} onClick={() => navigate('/menu')}>
                            <FaListUl /><button>View Menu</button>
                        </div>
                    </div>
                    <div className={styles.options}>
                        <div className={styles.delivery}>
                            <div className={styles.icon}>
                                <FaTruckFast />
                            </div>
                            <div className={styles.fetures}>
                                <p>Fast Delivery</p>
                                <p>30-40 min</p>
                            </div>
                        </div>
                        <div className={styles.qty}>
                            <div className={styles.icon}>
                                <FaAward />
                            </div>
                            <div className={styles.fetures}>
                                <p>Best Quality</p>
                                <p>Fresh Food</p>
                            </div>
                        </div>
                        <div className={styles.payment}>
                            <div className={styles.icon}>
                                <FaShieldHalved />
                            </div>
                            <div className={styles.fetures}>
                                <p>Safe Payment</p>
                                <p>100% Secure</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.main}>
                <section className={styles.popular_categories} data-aos="fade-up" data-aos-delay="50">
                    <div className={styles.section_header}>
                        <h2>Popular Categories</h2>
                        <a href="/menu">View All →</a>
                    </div>
                    <div className={styles.category_container}>
                        {
                            popularCategory.map((item, index) => (
                                <div className={styles.category_card} data-aos="zoom-in"
                                    data-aos-delay={index * 100} key={item._id}>
                                    <img src={item.image} alt={item.name}
                                        loading="lazy"
                                        decoding="async" />
                                    <h3>{item.name}</h3>
                                    <p>{item.productCount} Items</p>
                                </div>
                            ))
                        }
                    </div>
                </section>
                <section className={styles.fetured} data-aos="fade-left"
                    data-aos="flip-down"
                    data-aos-duration="1200">
                    <div className={styles.fetured_Container}>
                        <div className={styles.flat_container}>
                            <h3>Flat 20% OFF</h3>
                            <p>On All Orders</p>
                            <button> Use Code: BITE20</button>
                        </div>
                        <div className={styles.free_delivery}>
                            <h3>Free Delivery</h3>
                            <p>On orders above</p>
                            <h4>&#8377;199</h4>
                        </div>
                    </div>
                </section>
                <section className={styles.popular_dishes} data-aos="fade-right" data-aos-delay="0">
                    <div className={styles.section_header}>
                        <h2>Popular Dishes</h2>
                        <a href="/menu">View All →</a>
                    </div>
                    <div className={styles.dishes_cards}>
                        {
                            dishes.map((item, index) => (
                                <div className={styles.dishes_card} data-aos="zoom-in"
                                    data-aos-delay={index * 50}>
                                    <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                                    <div className={styles.dishes_info}>
                                        <h4>{item.name}</h4>
                                        <div className={styles.ratingcon}>
                                            <p className={styles.rating}><FaStar className={styles.start} /><p>{item.rating}</p></p>
                                            <p className={styles.review}>({item.reviews} Reviews)</p>
                                        </div>
                                        <div className={styles.con}>
                                            <p className={styles.price}>&#8377;{item.price}</p>
                                            {
                                                cartData[item._id] ?
                                                    <div className={styles.cart_product}>
                                                        <button onClick={() => increment(item._id)}>+</button>
                                                        <p>{cartData[item._id]}</p>
                                                        <button onClick={() => decrement(item._id)}>-</button>
                                                    </div> : <button onClick={() => addToCart(item._id)} >Add</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </section>
                <WhyChoose />
                <section className={styles.subscribe_section} data-aos="zoom-in" data-aos-delay="0">
                    <div className={styles.subscribe_card}>
                        <div className={styles.subscribe_content}>
                            <div className={styles.sub_head}>
                                <FaHamburger size={32} color="#FF6B35" />
                                <h2>
                                    Get Exclusive Offers</h2>
                            </div>
                            <p>
                                Subscribe now and receive special discounts, latest offers and food
                                updates directly in your inbox.
                            </p>
                        </div>
                        <form className={styles.subscribe_form}>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                            />
                            <button type="submit">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div >
    )
}
