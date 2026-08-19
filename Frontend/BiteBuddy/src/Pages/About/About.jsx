import React, { useContext } from 'react'
import styles from './About.module.css'
import assets from '../../assets/assets'
import WhyChoose from '../../Component/WhyChoose/WhyChoose'
import {
    FaUtensils,
    FaShoppingCart,
    FaCreditCard,
    FaMotorcycle
} from "react-icons/fa";
import {
    FaUsers,
    FaStore,
    FaStar
} from "react-icons/fa";
import { StoreContext } from '../../Context/StoreContext';
export default function About() {
    const { navigate } = useContext(StoreContext)
    return (
        <div className={styles.about_page}>
            <section className={styles.hero}>
                <div className={styles.hero_content}>
                    <h1>About <span>BiteBuddy</span></h1>
                    <h3>
                        Fresh Flavors,<br /> Delivered to Your Door.
                    </h3>
                    <p>
                        BiteBuddy is a one-stop destination for delicious pizzas, burgers,
                        pasta, sandwiches, desserts, and more. We prepare every order fresh,
                        use quality ingredients, and deliver it quickly so you can enjoy
                        restaurant-quality food from the comfort of your home.
                    </p>
                    <button type='button' onClick={() => navigate("/menu")}>Order Now</button>
                </div>
            </section>
            <div className={styles.main}>
                <section className={styles.story_section}>
                    <div className={styles.story_left}>
                        <span className={styles.story_tag}>Our Story</span>
                        <h2>Crafting Delicious Moments, One Meal at a Time</h2>
                        <p>
                            At BiteBuddy, our journey began with a simple dream — to serve
                            fresh, flavorful, and high-quality food that brings people
                            together. Every dish is carefully prepared using premium
                            ingredients and authentic recipes to ensure the perfect taste in
                            every bite.
                        </p>
                        <p>
                            From our kitchen to your table, we are committed to maintaining
                            the highest standards of quality, hygiene, and customer service.
                            Whether you're enjoying a quick lunch, a family dinner, or your
                            favorite comfort food, we strive to make every meal memorable.
                        </p>
                        <div className={styles.story_features}>
                            <div className={styles.feature}>
                                <h3>Fresh Ingredients</h3>
                                <p>Prepared daily with carefully selected ingredients.</p>
                            </div>
                            <div className={styles.feature}>
                                <h3>Made With Passion</h3>
                                <p>Every meal is cooked with love by our experienced chefs.</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.story_right}>
                        <img src={assets.aboutimg} alt="Our Story" />
                    </div>
                </section>
                <WhyChoose />
                <section className={styles.stats}>
                    <div className={styles.stat_card}>
                        <h2>
                            {/* <CountUp
                                end={10000}
                                duration={3}
                                separator=","
                            /> */}
                            10K+
                        </h2>
                        <p>Happy Customers</p>
                    </div>
                    <div className={styles.stat_card}>
                        <h2>
                            {/* <CountUp
                                end={150}
                                duration={3}
                            />
                            + */}150+
                        </h2>
                        <p>Top Restaurants</p>
                    </div>
                    <div className={styles.stat_card}>
                        <h2>
                            {/* <CountUp
                                end={50000}
                                duration={3}
                                separator=","
                            />
                            + */}50K
                        </h2>
                        <p>Orders Delivered</p>
                    </div>
                    <div className={styles.stat_card}>
                        <h2>
                            {/* <CountUp
                                end={4.8}
                                duration={3}
                                decimals={1}
                            />
                            ★ */}4.8★
                        </h2>
                        <p>Average Rating</p>
                    </div>
                </section>
                <section className={styles.how_work}>
                    <div className={styles.heading}>
                        <h2>How It Works</h2>
                        <p>
                            Ordering your favorite food has never been easier.
                            Follow these four simple steps and enjoy fresh meals at your doorstep.
                        </p>
                    </div>
                    <div className={styles.work_container}>
                        <div className={styles.work_card}>
                            <div className={styles.number}>1</div>
                            <div className={styles.icon}>
                                <FaUtensils />
                            </div>
                            <h3>Choose Food</h3>
                            <p>
                                Browse our delicious menu and pick your favorite meals.
                            </p>
                        </div>
                        <div className={styles.arrow}>→</div>
                        <div className={styles.work_card}>
                            <div className={styles.number}>2</div>
                            <div className={styles.icon}>
                                <FaShoppingCart />
                            </div>
                            <h3>Place Order</h3>
                            <p>
                                Add your favorite dishes to the cart and confirm your order.
                            </p>
                        </div>
                        <div className={styles.arrow}>→</div>
                        <div className={styles.work_card}>
                            <div className={styles.number}>3</div>
                            <div className={styles.icon}>
                                <FaCreditCard />
                            </div>
                            <h3>Secure Payment</h3>
                            <p>
                                Complete your payment safely using our trusted payment methods.
                            </p>
                        </div>
                        <div className={styles.arrow}>→</div>
                        <div className={styles.work_card}>
                            <div className={styles.number}>4</div>
                            <div className={styles.icon}>
                                <FaMotorcycle />
                            </div>
                            <h3>Fast Delivery</h3>
                            <p>
                                Sit back and relax while we deliver your meal hot and fresh.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
