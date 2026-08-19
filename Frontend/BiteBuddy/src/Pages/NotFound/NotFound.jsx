import React from "react";
import styles from "./NotFound.module.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
const NotFound = () => {
    const { navigate } = useContext(StoreContext)
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