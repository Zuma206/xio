import styles from "../styles/Message.module.scss";
import { MessageResult, UserResult } from "../xio";
import formatRelative from "date-fns/formatRelative";
import Embed from "./Embed";
import MessageContent from "./MessageContent";
import { CachedUserHook } from "../xio/userCache";

interface props {
    data: MessageResult;
    useCachedUser: CachedUserHook;
}

export default ({ data, useCachedUser }: props) => {
    const userData = useCachedUser(data.user);

    return (
        <>
            <div
                className={
                    data.clientSide === true
                        ? styles.clientMessage
                        : styles.message
                }
            >
                <img
                    src={userData?.gravatar ?? ""}
                    alt=" "
                    className={styles.picture}
                />
                <div>
                    <div
                        className={
                            data.clientSide === true
                                ? undefined
                                : styles.username
                        }
                    >
                        {userData?.username ?? ""}{" "}
                        <span className={styles.date}>
                            {formatRelative(data.timestamp, Date.now())}
                        </span>
                    </div>
                    <div>
                        <MessageContent content={data.content} />
                    </div>
                </div>
            </div>
            {data.content
                .split(" ")
                .filter(
                    (part) =>
                        part.startsWith("https://") ||
                        part.startsWith("http://")
                )
                .map((link, key) => {
                    return <Embed key={key} src={link} />;
                })}
        </>
    );
};
