import HeaderBar from "../components/HeaderBar";
import styles from "../styles/404.module.scss";
import { Link } from "react-router-dom";

export default () => {
    return (
        <HeaderBar>
            <div className={styles.notFound}>
                <h1>Route not found :/</h1>
                <Link to="/">
                    <button className={styles.button}>
                        Take me somewhere real
                    </button>
                </Link>
            </div>
        </HeaderBar>
    );
};
