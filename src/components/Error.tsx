import styles from "../styles/Error.module.scss";

export default () => {
    return (
        <div className={styles.container}>
            <div className={styles.error}>
                <div className={styles.message}>
                    <div className={styles.title}>FirebaseError</div>
                    <div>auth-firebase-error</div>
                </div>
                <div>
                    <button className={styles.button}>Close</button>
                </div>
            </div>
        </div>
    );
};
