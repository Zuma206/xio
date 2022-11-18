import { useEffect, useState } from "react";
import styles from "../styles/MessageList.module.scss";
import { MessageResult, useXIOUser, UserResult, fetchMessages } from "../xio";
import Message from "./Message";
import Pusher from "pusher-js";
import MessageBox from "./MessageBox";

interface props {
    channelId: string | null;
}

export default ({ channelId }: props) => {
    const [messages, setMessages] = useState<MessageResult[] | null>(null);
    const [user] = useXIOUser();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ [x: string]: UserResult }>({});

    useEffect(() => {
        if (!channelId || user == "known" || user == "unknown") return;

        fetchMessages(
            setMessages,
            channelId,
            [users, setUsers],
            user,
            setLoading
        );
    }, [channelId]);

    useEffect(() => {
        if (!channelId) return;

        const pusher = new Pusher("d2eb302d2ea834126d7a", { cluster: "eu" });
        pusher
            .subscribe(channelId)
            .bind("message", (message: MessageResult) => {
                setMessages((messages) => {
                    return messages ? [...messages, message] : messages;
                });
            });

        return () => {
            pusher.disconnect();
        };
    }, [channelId]);

    return messages && !loading ? (
        <div className={styles.container}>
            <div className={styles.messageList}>
                {messages.map((message) => {
                    return (
                        <div key={message.key}>
                            <Message
                                data={message}
                                userData={users[message.user]}
                            />
                        </div>
                    );
                })}
            </div>
            <MessageBox channelId={channelId ?? ""} />
        </div>
    ) : (
        <div className={styles.padded}>Loading...</div>
    );
};
