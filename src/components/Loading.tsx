import styles from "../styles/Loading.module.scss";
import { useLoading } from "../xio";

export default () => {
    const [, , loading] = useLoading();

    return loading > 0 ? (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
        </div>
    ) : null;
};
