import styles from "../styles/Message.module.scss";
import { MessageResult, UserResult } from "../xio";
import formatRelative from "date-fns/formatRelative";
import defaultPicture from "../assets/user.png";
import Embed from "./Embed";

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
                    src={userData?.gravatar ?? defaultPicture}
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
                        <div className={styles.content}>
                            {data.content.split(" ").map((part, key) => {
                                let returnPart;
                                if (
                                    !part.startsWith("https://") &&
                                    !part.startsWith("http://")
                                ) {
                                    returnPart = part;
                                } else {
                                    returnPart = (
                                        <a
                                            href={part}
                                            target="_blank"
                                            className={styles.link}
                                        >
                                            {part}
                                        </a>
                                    );
                                }
                                return <span key={key}>{returnPart} </span>;
                            })}
                        </div>
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
