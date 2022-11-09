import React from "react";
import styles from "../styles/HeaderBar.module.scss";
import logo from "../assets/bitmap.png";

export default ({ children }: React.PropsWithChildren) => {
    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>
                <div>
                    <img src={logo} alt="XIO" className={styles.logo} />
                </div>

                <div>
                    <button className={styles.button}>Profile Picture</button>
                    <button className={styles.button}>Sign Out</button>
                    <img
                        src="https://lh3.googleusercontent.com/ogw/AOh-ky2B6XOWkd0-x6YylezroKu_3UWQt6GvhNfodttwvA=s32-c-mo"
                        alt="XIO"
                        className={styles.profilePic}
                    />
                </div>
            </div>
            {children}
        </div>
    );
};
