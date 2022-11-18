import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/MessageBox.module.scss";
import { MessageResult, sendMessage, useXIOUser } from "../xio";
import { v4 as uuid } from "uuid";

type props = {
    channelId: string;
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>;
};

export default ({ channelId, setMessages }: props) => {
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
                />
            </form>
        </div>
    );
};
