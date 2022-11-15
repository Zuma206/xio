import { useEffect, useRef, useState } from "react";
import styles from "../styles/MessageList.module.scss";
import {
    CreatedMessage,
    getUserById,
    sendMessage,
    subscribeMessages,
    useXIOUser,
    XIOUserResponse,
} from "../xio";
import Message from "./Message";
import Pusher from "pusher-js";

interface props {
    channelId: string | null;
}

export default ({ channelId }: props) => {
    const [messages, setMessages] = useState<CreatedMessage[] | null>(null);
    const [user] = useXIOUser();
    const [typedMessage, setTypedMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ [x: string]: XIOUserResponse }>({});

    const fetchMessages = async (users: { [x: string]: XIOUserResponse }) => {
        if (channelId == null || user == "known" || user == "unknown") return;
        const messages = (await subscribeMessages(
            channelId,
            await user.googleUser.getIdToken()
        )) as CreatedMessage[];

        const doneIds: string[] = [];
        for (let message of messages) {
            if (message.user in doneIds || message.user in users) continue;
            const fetchedUser = await getUserById(
                message.user,
                await user.googleUser.getIdToken()
            );
            setUsers((users) => {
                users[message.user] = fetchedUser;
                return users;
            });
            doneIds.push(message.user);
        }

        setMessages(messages);
        setLoading(false);
    };

    useEffect(() => {
        if (
            user == "known" ||
            user == "unknown" ||
            user.activated != "activated" ||
            !channelId
        )
            return;
        fetchMessages(users);
    }, [channelId]);

    useEffect(() => {
        if (!channelId) return;

        const pusher = new Pusher("d2eb302d2ea834126d7a", { cluster: "eu" });
        pusher
            .subscribe(channelId)
            .bind("message", (message: CreatedMessage) => {
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
            <div className={styles.messageBox}>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!channelId || user == "known" || user == "unknown")
                            return;
                        setTypedMessage("");
                        await sendMessage(
                            channelId,
                            typedMessage,
                            await user.googleUser.getIdToken()
                        );
                    }}
                >
                    <input
                        className={styles.messageText}
                        type="text"
                        placeholder="Type your message here..."
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                    />
                </form>
            </div>
        </div>
    ) : (
        <div className={styles.padded}>Loading...</div>
    );
};
