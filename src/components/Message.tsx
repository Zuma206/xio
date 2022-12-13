import styles from "../styles/Message.module.scss";
import { MessageResult, parseMessage } from "../xio";
import formatRelative from "date-fns/formatRelative";
import Embed from "./Embed";
import MessageContent from "./MessageContent";
import { CachedUserHook } from "../xio/userCache";
import { RefObject } from "react";

interface props {
    data: MessageResult;
    useCachedUser: CachedUserHook;
    scroll: boolean;
    scrollDirection: "up" | "down";
    end: RefObject<HTMLDivElement>;
}

export default ({
    data,
    useCachedUser,
    scroll,
    scrollDirection,
    end,
}: props) => {
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
                <div className={styles.messageContent}>
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
                            {userData?.dev ? "🛠️ " : null}
                            <span className={styles.date}>
                                {formatRelative(data.timestamp, Date.now())}
                            </span>
                        </div>
                        <div className={styles.wrap}>
                            <MessageContent content={data.content} />
                        </div>
                    </div>
                </div>
                {parseMessage(data.content)
                    .filter(({ type }) => type == "link")
                    .map(({ value }, index) => (
                        <Embed
                            src={value}
                            key={index}
                            scroll={scroll}
                            scrollDirection={scrollDirection}
                            end={end}
                        />
                    ))}
            </div>
        </>
    );
};
