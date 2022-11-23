import { useEffect, useRef, useState } from "react";
import styles from "../styles/MessageList.module.scss";
import {
    MessageResult,
    useXIOUser,
    fetchMessages,
    connectPusher,
    getChunk,
} from "../xio";
import Message from "./Message";
import Pusher from "pusher-js";
import MessageBox from "./MessageBox";
import ChannelSettings from "./ChannelSettings";
import { useUserCache } from "../xio/userCache";

interface props {
    channelId: string | null;
}

export default ({ channelId }: props) => {
    const [messages, setMessages] = useState<MessageResult[] | null>(null);
    const [user] = useXIOUser();
    const [loading, setLoading] = useState(false);
    const [pusher, setPusher] = useState<Pusher | null>(null);
    const [settings, setSettings] = useState(false);
    const end = useRef<HTMLDivElement>(null);
    const [scroll, setScroll] = useState(true);
    const useCachedUser = useUserCache();

    useEffect(() => {
        if (!end.current || !scroll) return;
        end.current.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        if (
            !channelId ||
            user == "known" ||
            user == "unknown" ||
            !useCachedUser
        )
            return;

        fetchMessages(setMessages, channelId, user, setLoading, useCachedUser);
    }, [channelId]);

    useEffect(() => {
        if (!channelId) return;
        return connectPusher({
            channelId,
            pusher,
            setPusher,
            user,
            setMessages,
        });
    }, [channelId, pusher]);

    return messages && !loading && useCachedUser ? (
        <div className={styles.container}>
            {settings ? (
                <ChannelSettings
                    channelId={channelId ?? ""}
                    setSettings={setSettings}
                    useCachedUser={useCachedUser}
                />
            ) : (
                <>
                    <div
                        className={styles.messageList}
                        onScroll={({ currentTarget: list }) => {
                            if (
                                list.scrollTop ==
                                list.scrollHeight - list.offsetHeight
                            ) {
                                setScroll(true);
                            } else {
                                setScroll(false);
                            }
                        }}
                    >
                        <button
                            className={styles.button}
                            onClick={async () => {
                                if (user == "known" || user == "unknown")
                                    return;
                                const token =
                                    await user.googleUser.getIdToken();
                                const newMessages = await getChunk(
                                    channelId ?? "",
                                    messages[0].key,
                                    token
                                );
                                console.log(newMessages);
                                setMessages((messages) => {
                                    return messages
                                        ? [...newMessages, ...messages]
                                        : messages;
                                });
                            }}
                        >
                            Load More
                        </button>
                        {messages.map((message, key) => {
                            return (
                                <div key={key}>
                                    <Message
                                        data={message}
                                        useCachedUser={useCachedUser}
                                    />
                                </div>
                            );
                        })}
                        <div ref={end} />
                    </div>
                    <MessageBox
                        channelId={channelId ?? ""}
                        setMessages={setMessages}
                        setSettings={setSettings}
                        setScroll={setScroll}
                    />
                </>
            )}
        </div>
    ) : (
        <div className={styles.padded}>Loading...</div>
    );
};
