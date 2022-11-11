import HeaderBar from "../components/HeaderBar";
import styles from "../styles/404.module.scss";
import { Link } from "react-router-dom";

export default () => {
    return (
        <HeaderBar>
            <div className={styles.notFound}>
                <h1>XIO User Agreement</h1>

                <p>You will have your account permenantly disabled if you:</p>
                <ol>
                    <li>
                        Exploit any rules or restrictions (such as rate limits)
                    </li>
                </ol>

                <Link to="/">
                    <button className={styles.button}>Sounds Good</button>
                </Link>
            </div>
        </HeaderBar>
    );
};
