import React, { useEffect } from 'react'
import {
    FaMotorcycle,
    FaLeaf,
    FaShieldAlt,
    FaTags,
    FaHeadset
} from "react-icons/fa";
import styles from './WhyChoose.module.css'
export default function WhyChoose() {
    return (
        <section className={styles.why_choose} data-aos="fade-left"
            data-aos-offset="200"
            data-aos-duration="1000">
            <div className={styles.section_title}>
                <h2>Why Choose BiteBuddy?</h2>
                <p>
                    We're committed to serving fresh, delicious food with fast delivery
                    and exceptional customer service every single day.
                </p>
            </div>
            <div className={styles.choose_container}>
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <FaMotorcycle />
                    </div>
                    <h3>Fast Delivery</h3>
                    <p>
                        Enjoy hot and freshly prepared meals delivered to your doorstep
                        quickly and safely.
                    </p>
                </div>
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <FaLeaf />
                    </div>
                    <h3>Fresh & Quality Food</h3>
                    <p>
                        Every meal is prepared using fresh ingredients to ensure
                        exceptional taste and premium quality.
                    </p>
                </div>
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <FaShieldAlt />
                    </div>
                    <h3>Secure Payment</h3>
                    <p>
                        Make every payment with confidence through our safe and secure
                        payment options.
                    </p>
                </div>
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <FaTags />
                    </div>
                    <h3>Great Offers</h3>
                    <p>
                        Get exciting discounts, combo deals, and exclusive offers on
                        your favorite meals.
                    </p>
                </div>
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <FaHeadset />
                    </div>
                    <h3>24/7 Support</h3>
                    <p>
                        Our support team is always available to help you with orders and
                        any questions you may have.
                    </p>
                </div>
            </div>
        </section>
    )
}
