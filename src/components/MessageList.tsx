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
    const [pusher, setPusher] = useState<Pusher | null>(null);

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
        if (!pusher) {
            setPusher(
                new Pusher("d2eb302d2ea834126d7a", {
                    cluster: "eu",
                })
            );
            return;
        }

        pusher
            .subscribe(channelId)
            .bind("message", (newMessage: MessageResult) => {
                setMessages((messages) => {
                    if (!messages) return messages;
                    let messageAdded = false;
                    messages = messages.map((currentMessage) => {
                        if (newMessage.clientKey === currentMessage.clientKey) {
                            currentMessage.clientSide = false;
                            messageAdded = true;
                        }
                        return currentMessage;
                    });
                    if (!messageAdded) {
                        messages.push(newMessage);
                    }
                    return messages;
                });
            });

        return () => {
            pusher.unbind_all();
            pusher.unsubscribe(channelId);
        };
    }, [channelId, pusher]);

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
            <MessageBox channelId={channelId ?? ""} setMessages={setMessages} />
        </div>
    ) : (
        <div className={styles.padded}>Loading...</div>
    );
};
