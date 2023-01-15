import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Columns.module.scss";
import { useXIOUser } from "../xio";

export default ({ children }: React.PropsWithChildren) => {
    // Take first 2 children to place in left and right columns
    const [Left, Right] = React.Children.toArray(children);
    const mainRef = useRef<HTMLDivElement | null>(null);
    const [user] = useXIOUser();

    useEffect(() => {
        if (!mainRef.current) return;
        mainRef.current.scrollIntoView();
    }, []);

    return (
        <div className={styles.container}>
            {user == "unknown" || user == "known" ? null : (
                <div className={styles.left}>{Left}</div>
            )}
            <div className={styles.right} ref={mainRef}>
                {Right}
            </div>
        </div>
    );
};
