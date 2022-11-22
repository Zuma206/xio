import styles from "../styles/Message.module.scss";
import { MessageResult, UserResult } from "../xio";
import formatRelative from "date-fns/formatRelative";
import Embed from "./Embed";
import MessageContent from "./MessageContent";

interface props {
    data: MessageResult;
    userData: UserResult | undefined;
}

export default ({ data, userData }: props) => {
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
                    src={
                        userData?.gravatar ?? "https://www.gravatar.com/avatar"
                    }
                    alt=""
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
                        {userData?.username ?? "Loading User..."}{" "}
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
