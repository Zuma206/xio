import React from "react";
import styles from "../styles/Columns.module.scss";

export default ({ children }: React.PropsWithChildren) => {
    const [Left, Right] = React.Children.toArray(children);

    return (
        <div className={styles.container}>
            <div className={styles.left}>{Left}</div>
            <div className={styles.right}>{Right}</div>
        </div>
    );
};
