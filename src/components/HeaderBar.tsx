import styles from "../styles/HeaderBar.module.scss";
import logo from "../assets/xlogo.svg";
import { useAuth } from "../xio";
import UserProfile from "./UserProfile";

export default ({ children }: React.PropsWithChildren) => {
    // get user auth from the client api
    const user = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>
                <div>
                    <img src={logo} alt="XIO" className={styles.logo} />
                </div>

                <div></div>

                <div>
                    <UserProfile />
                </div>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};
