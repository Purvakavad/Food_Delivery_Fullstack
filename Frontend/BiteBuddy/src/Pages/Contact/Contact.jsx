import React from "react";
import styles from "./Contact.module.css";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock
} from "react-icons/fa";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaWhatsapp,
    FaChevronDown
} from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { useState } from "react";
import assets from "../../assets/assets";
const Contact = () => {
    const [active, setActive] = useState(null);
    const toggleFAQ = (index) => {
        setActive(active === index ? null : index);
    };
    return (
        <div className={styles.contact}>
            <section className={styles.hero}>
                <div className={styles.left}>
                    <h1>Contact Us</h1>
                    <h3>We'd love to hear from you!</h3>
                    <p>
                        Have a question, suggestion, or feedback? <br />
                        Reach out to us and we'll get back to you soon.
                    </p>
                </div>
            </section>
            <div className={styles.main}>
                <section className={styles.cards}>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <FaPhoneAlt />
                        </div>
                        <div>
                            <h4>Call Us</h4>
                            <p>+91 98765 43210</p>
                            <span>Mon - Sun | 9:00 AM - 10:00 PM</span>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <FaEnvelope />
                        </div>
                        <div>
                            <h4>Email Us</h4>
                            <p>support@bitebuddy.com</p>
                            <span>We reply within 24 hours</span>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <FaMapMarkerAlt />
                        </div>
                        <div>
                            <h4>Our Location</h4>
                            <p>123, Food Street</p>
                            <span>Your City - 123456</span>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <FaClock />
                        </div>
                        <div>
                            <h4>Working Hours</h4>
                            <p>Mon - Sun</p>
                            <span>9:00 AM - 11:00 PM</span>
                        </div>
                    </div>
                </section>
                <section className={styles.contact_container}>
                    <div className={styles.form_box}>
                        <h2>Send Us a Message</h2>
                        <form>
                            <div className={styles.input_group}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className={styles.input_group}>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className={styles.input_group}>
                                <label>Phone Number</label>
                                <input
                                    type="number"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                            <div className={styles.input_group}>
                                <label>Subject</label>
                                <select required>
                                    <option>Select a subject</option>
                                    <option>Order Issue</option>
                                    <option>Payment Issue</option>
                                    <option>Feedback</option>
                                    <option>Support</option>
                                </select>
                            </div>
                            <div className={styles.input_group}>
                                <label>Message</label>
                                <textarea
                                    rows="6"
                                    placeholder="Type your message here..."
                                    required
                                ></textarea>
                            </div>
                            <button>
                                Send Message
                            </button>
                        </form>
                    </div>
                    <div className={styles.map_box}>
                        <h2>Find Us Here</h2>
                        <iframe
                            title="map"
                            src="https://www.google.com/maps?q=Surat,Gujarat&output=embed"
                            loading="lazy"
                        ></iframe>
                    </div>
                </section>
                <section className={styles.bottom_container}>
                    <div className={styles.help_box}>
                        <div>
                            <h2>We are here to help you!</h2>
                            <p>
                                Our customer support team is always ready
                                to assist you with any issues.
                            </p>
                            <button>Chat with us</button>
                        </div>
                    </div>
                    <div className={styles.social_box}>
                        <h2>Connect With Us</h2>
                        <p>
                            Follow us on social media for latest
                            updates, offers & more.
                        </p>
                        <div className={styles.social_icons}>
                            <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                            <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                            <a href="https://x.com/" target="_blank" aria-label="X" rel="noopener noreferrer"><FaTwitter /></a>
                            <a href="https://www.whatsapp.com/" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                        </div>
                    </div>
                </section>
                <section className={styles.faq_section}>
                    <div className={styles.faq_left}>
                        <h2>Frequently Asked Questions</h2>
                        <div className={styles.faq_box}>
                            <div
                                className={styles.faq_item}
                                onClick={() => toggleFAQ(1)}
                            >
                                <span>How can I track my order?</span>
                                <FaChevronDown className={active === 1 ? styles.rotate : ""} />
                            </div>
                            {active === 1 && (
                                <div className={styles.answer}>
                                    You can track your order from the <b>My Orders</b> page.
                                </div>
                            )}
                        </div>
                        <div className={styles.faq_box}>
                            <div
                                className={styles.faq_item}
                                onClick={() => toggleFAQ(2)}
                            >
                                <span>What payment methods do you accept?</span>
                                <FaChevronDown className={active === 2 ? styles.rotate : ""} />
                            </div>
                            {active === 2 && (
                                <div className={styles.answer}>
                                    We accept UPI, Credit Card, Debit Card, Net Banking and Cash on Delivery.
                                </div>
                            )}
                        </div>
                        <div className={styles.faq_box}>
                            <div
                                className={styles.faq_item}
                                onClick={() => toggleFAQ(3)}
                            >
                                <span>Can I cancel or modify my order?</span>
                                <FaChevronDown className={active === 3 ? styles.rotate : ""} />
                            </div>
                            {active === 3 && (
                                <div className={styles.answer}>
                                    Yes, you can cancel or modify your order before it is prepared.
                                </div>
                            )}
                        </div>
                        <div className={styles.faq_box}>
                            <div
                                className={styles.faq_item}
                                onClick={() => toggleFAQ(4)}
                            >
                                <span>How can I return a product?</span>
                                <FaChevronDown className={active === 4 ? styles.rotate : ""} />
                            </div>
                            {active === 4 && (
                                <div className={styles.answer}>
                                    Go to <b>My Orders</b>, select the product and request a return if it is eligible.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.food_banner}>
                        <img src={assets.contectimg} alt="" />
                    </div>
                </section>
            </div>
        </div>
    );
};
export default Contact;