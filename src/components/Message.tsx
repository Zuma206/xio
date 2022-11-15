import styles from "../styles/Message.module.scss";
import { CreatedMessage, XIOUserResponse, useXIOUser } from "../xio";

interface props {
    data: CreatedMessage;
    userData: XIOUserResponse;
}

export default ({ data, userData }: props) => {
    const [user] = useXIOUser();

    return userData ? (
        <div className={styles.message}>
            <img src={userData.gravatar} alt="" className={styles.picture} />
            <div>
                <div className={styles.username}>{userData.username}</div>
                <div className={styles.content}>{data.content}</div>
            </div>
        </div>
    ) : null;
};
