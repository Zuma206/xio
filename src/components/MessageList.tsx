import { useEffect, useState } from "react";
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

interface props {
    channelId: string | null;
}

export default ({ channelId }: props) => {
    const [messages, setMessages] = useState<CreatedMessage[] | null>(null);
    const [user] = useXIOUser();
    const [typedMessage, setTypedMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ [x: string]: XIOUserResponse }>({});

    const fetchMessages = async () => {
        if (channelId == null || user == "known" || user == "unknown") return;
        const messages = (await subscribeMessages(
            channelId,
            await user.googleUser.getIdToken()
        )) as CreatedMessage[];

        for (let message of messages) {
            if (message.user in users) continue;
            const userData = await getUserById(
                message.user,
                await user.googleUser.getIdToken()
            );
            setUsers((users) => {
                const newUsers = { ...users };
                newUsers[message.user] = userData;
                return newUsers;
            });
        }

        setMessages(messages);
        setLoading(false);
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
