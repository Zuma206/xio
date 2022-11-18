import styles from "../styles/Message.module.scss";
import { MessageResult, UserResult } from "../xio";

interface props {
    data: MessageResult;
    userData: UserResult;
}

export default ({ data, userData }: props) => {
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
