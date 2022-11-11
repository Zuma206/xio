import HeaderBar from "../components/HeaderBar";
import styles from "../styles/404.module.scss";
import { Link } from "react-router-dom";

export default () => {
    return (
        <HeaderBar>
            <div className={styles.notFound}>
                <h1>XIO User Agreement</h1>

                <p>
                    You will have your account permenantly disabled if you break
                    the golden rules:
                </p>
                <ol>
                    <li>
                        Discrimination is prohibited (this includes saying
                        discriminatory words).
                    </li>
                    <li>
                        Attempting to bypass limitations, or attempting to
                        exploit the database
                    </li>
                    <li>
                        Misusing features to attempt to break other user's
                        experience
                    </li>
                </ol>

                <Link to="/">
                    <button className={styles.button}>Sounds Good</button>
                </Link>
            </div>
        </HeaderBar>
    );
};
