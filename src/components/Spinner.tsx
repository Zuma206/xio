import styles from "../styles/Spinner.module.scss";

export default () => {
    return (
        <div className={styles.padded}>
            <div className={styles.spinner}></div>
        </div>
    );
};
