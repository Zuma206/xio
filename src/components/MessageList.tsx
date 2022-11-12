import { useEffect, useState } from "react";
import styles from "../styles/MessageList.module.scss";
import {
    Message as MessageType,
    subscribeMessages,
    useXIOUser,
    XIOUser,
} from "../xio";
import Message from "./Message";

interface props {
    channelId: string | null;
}

export default ({ channelId }: props) => {
    const [messages, setMessages] = useState<MessageType[] | null>(null);
    const [user] = useXIOUser();

    const fetchMessages = async () => {
        if (channelId == null) return;
        const messages = await subscribeMessages(channelId);
        setMessages(messages);
    };

    useEffect(() => {
        if (
            user == "known" ||
            user == "unknown" ||
            user.activated != "activated"
        )
            return;

        fetchMessages();
    }, [channelId]);

    return messages ? (
        <div className={styles.container}>
            <div className={styles.messageList}>
                {messages.map((message) => {
                    return (
                        <div key={message.id}>
                            <Message data={message} />
                        </div>
                    );
                })}
            </div>
            <div className={styles.messageBox}>
                <input
                    className={styles.messageText}
                    type="text"
                    placeholder="Type your message here..."
                />
            </div>
        </div>
    ) : (
        <div className={styles.padded}>Loading...</div>
    );
};
