import styles from "../styles/Message.module.scss";
import { MessageResult, UserResult } from "../xio";
import formatRelative from "date-fns/formatRelative";

interface props {
    data: MessageResult;
    userData: UserResult;
}

export default ({ data, userData }: props) => {
    return userData ? (
        <div
            className={
                data.clientSide === true ? styles.clientMessage : styles.message
            }
        >
            <img src={userData.gravatar} alt="" className={styles.picture} />
            <div>
                <div
                    className={
                        data.clientSide === true ? undefined : styles.username
                    }
                >
                    {userData.username}{" "}
                    <span className={styles.date}>
                        {formatRelative(data.timestamp, Date.now())}
                    </span>
                </div>
                <div className={styles.content}>{data.content}</div>
            </div>
        </div>
    ) : null;
};
