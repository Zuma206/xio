import { Dispatch, RefObject, SetStateAction, useState } from "react";
import styles from "../styles/MessageBox.module.scss";
import { MessageResult, sendMessage, useXIOUser } from "../xio";
import { v4 as uuid } from "uuid";

type props = {
    channelId: string;
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>;
    setSettings: Dispatch<SetStateAction<boolean>>;
    setScroll: Dispatch<SetStateAction<boolean>>;
    isLive: boolean;
};

export default ({
    channelId,
    setMessages,
    setSettings,
    setScroll,
    isLive,
}: props) => {
    const [user] = useXIOUser();
    const [message, setMessage] = useState("");

    return (
        <div className={styles.messageBox}>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (user == "known" || user == "unknown") return;
                    setMessage("");
                    const clientKey = uuid();
                    const newMessage: MessageResult = {
                        key: uuid(),
                        clientKey,
                        content: message,
                        user: user.googleUser.uid,
                        timestamp: Date.now(),
                        clientSide: true,
                    };
                    setScroll(true);
                    setMessages((messages: MessageResult[] | null) => {
                        return messages ? [...messages, newMessage] : messages;
                    });
                    await sendMessage(
                        channelId,
                        message,
                        clientKey,
                        await user.googleUser.getIdToken()
                    );
                }}
            >
                <input
                    className={styles.messageText}
                    type="text"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!isLive}
                />
            </form>
            <div className={styles.buttons}>
                <button
                    className={styles.button}
                    onClick={(e) => {
                        e.preventDefault();
                        setSettings(true);
                    }}
                >
                    Settings
                </button>
            </div>
        </div>
    );
};
