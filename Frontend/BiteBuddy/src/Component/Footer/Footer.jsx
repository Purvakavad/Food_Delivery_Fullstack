import React from 'react'
import {
    FaFacebookF,
    FaWhatsapp,
    FaInstagram,
    FaXTwitter,
    FaLocationDot
} from "react-icons/fa6";
import { FiPhoneCall } from "react-icons/fi";
import styles from './Footer.module.css'
import { MdEmail } from "react-icons/md";
export default function Footer() {
    return (
        <div>
            <div className={styles.footer}>
                <div className={styles.footer_container}>
                    <div className={styles.columns}>
                        <h1><span>Bite</span>Buddy</h1>
                        <p>Delicious food deliverd fast to your dorostep. <br /> Enjoy every bite!</p>
                        <div className={styles.social_icon}>
                            <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                                <FaFacebookF className={styles.icon} />
                            </a>
                            <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className={styles.icon} />
                            </a>
                            <a href="https://www.whatsapp.com/" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp className={styles.icon} />
                            </a>
                            <a href="https://x.com/" aria-label="X" target="_blank" rel="noopener noreferrer">
                                <FaXTwitter className={styles.icon} />
                            </a>
                        </div>
                    </div>
                    <div className={styles.columns}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/menu">Menu</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className={styles.columns}>
                        <h4>Our Info</h4>
                        <ul>
                            <li><FiPhoneCall /><p>+91 98342 32432</p></li>
                            <li>< MdEmail /> <p>bitebuddy@gmail.com</p></li>
                            <li><FaLocationDot /> <p>123,food street,surat - 395020</p></li>
                            <li></li>
                        </ul>
                    </div>
                    <div className={styles.columns}>
                        <h4>Opening Hours</h4>
                        <ul>
                            <li>Monday - Sunday</li>
                            <li>10:00AM - 11:00PM</li>
                        </ul>
                        <p>We are open on all days.</p>
                    </div>
                </div>
                <hr />
                <div className={styles.bottom_footer}>
                    <p>&copy; 2026 BiteBuddy. All rights reserved. Develop by Purva Kavad</p>
                </div>
            </div>
        </div>
    )
}
