import React, { useEffect, useState } from "react";
import styles from "../styles/Columns.module.scss";

export default ({ children }: React.PropsWithChildren) => {
    // Take first 2 children to place in left and right columns
    const [Left, Right] = React.Children.toArray(children);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", (e) => {
            setScreenWidth(window.innerWidth);
        });
    }, []);

    return screenWidth > 900 ? (
        <div className={styles.container}>
            <div className={styles.left}>{Left}</div>
            <div className={styles.right}>{Right}</div>
        </div>
    ) : (
        <div className={styles.container}>
            <div className={styles.right}>{Right}</div>
            <div className={styles.left}>{Left}</div>
        </div>
    );
};
