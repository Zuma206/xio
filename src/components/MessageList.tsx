import { useEffect, useState } from "react";
import styles from "../styles/MessageList.module.scss";
import {
    MessageResult,
    useXIOUser,
    UserResult,
    fetchMessages,
    fetchAndCacheUser,
} from "../xio";
import Message from "./Message";
import Pusher from "pusher-js";
import MessageBox from "./MessageBox";
import ChannelSettings from "./ChannelSettings";

interface props {
    channelId: string | null;
}

export default ({ channelId }: props) => {
    const [messages, setMessages] = useState<MessageResult[] | null>(null);
    const [user] = useXIOUser();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<{ [x: string]: UserResult }>({});
    const [pusher, setPusher] = useState<Pusher | null>(null);
    const [settings, setSettings] = useState(false);

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

        pusher.connection.bind(
            "state_change",
            (states: { current: string; previous: string }) => {
                console.log(
                    "[PUSHER STATE CHANGE]",
                    states.previous,
                    states.current
                );
            }
        );

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
            })
            .bind("clear", () => {
                setMessages([]);
            })
            .bind("deleted", () => {
                location.reload();
            })
            .bind("kicked", (userId: string) => {
                if (user == "known" || user == "unknown") return;
                if (userId != user.googleUser.uid) return;
                location.reload();
            });

        return () => {
            pusher.unbind_all();
            pusher.unsubscribe(channelId);
        };
    }, [channelId, pusher]);

    return messages && !loading ? (
        <div className={styles.container}>
            {settings ? (
                <ChannelSettings
                    channelId={channelId ?? ""}
                    setSettings={setSettings}
                    userCacheState={[users, setUsers]}
                />
            ) : (
                <>
                    <div className={styles.messageList}>
                        {messages.map((message) => {
                            if (
                                !(message.user in users) &&
                                user != "known" &&
                                user != "unknown"
                            ) {
                                user.googleUser
                                    .getIdToken()
                                    .then((authToken) => {
                                        fetchAndCacheUser(
                                            message.user,
                                            setUsers,
                                            authToken
                                        );
                                    });
                            }

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
                    <MessageBox
                        channelId={channelId ?? ""}
                        setMessages={setMessages}
                        setSettings={setSettings}
                    />
                </>
            )}
        </div>
    ) : (
        <div className={styles.padded}>Loading...</div>
    );
};
