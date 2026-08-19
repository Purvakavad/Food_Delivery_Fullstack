import React from "react";
import styles from "./NotFound.module.css";
import { useContext } from "react";
import { AdminContext } from "../../Context/AdminContext";

const NotFound = () => {
    const { navigate } = useContext(AdminContext);
    return (
        <div className={styles.notFound}>
            <div className={styles.content}>
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>
                    Sorry, the page you're looking for doesn't exist
                    or has been moved.
                </p>
                <button
                    className={styles.homeBtn}
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;