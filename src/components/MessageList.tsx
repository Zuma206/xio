import { useEffect, useRef, useState } from "react";
import styles from "../styles/MessageList.module.scss";
import Message from "./Message";
import Pusher from "pusher-js";
import MessageBox from "./MessageBox";
import ChannelSettings from "./ChannelSettings";
import { useUserCache } from "../xio/userCache";
import {
    MessageResult,
    useXIOUser,
    fetchMessages,
    connectPusher,
    getChunk,
    getPusher,
    useError,
} from "../xio";

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
    const start = useRef<HTMLDivElement>(null);
    const [scroll, setScroll] = useState(true);
    const useCachedUser = useUserCache();
    const [lastMessage, setLastMessage] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(true);
    const [loadingOldMessages, setLoadingOldMessages] = useState(false);
    const [displayError] = useError("Uh oh!");
    const [scrollDirection, setScrollDirection] = useState<"up" | "down">(
        "down"
    );

    useEffect(() => {
        if (scrollDirection == "down" && end.current && scroll) {
            end.current.scrollIntoView();
        } else if (scrollDirection == "up" && start.current) {
            start.current.scrollIntoView();
        }
    }, [messages]);

    useEffect(() => {
        if (
            !channelId ||
            user == "known" ||
            user == "unknown" ||
            !useCachedUser
        )
            return;

        const error = fetchMessages(
            setMessages,
            channelId,
            user,
            setLoading,
            setLastMessage
        );
        (async () => {
            const err = await error;
            if (err) {
                displayError({
                    name: "Error fetching messages",
                    message: "",
                    code: err.response,
                });
            }
        })();
    }, [channelId]);

    useEffect(() => {
        if (!channelId || user == "known" || user == "unknown") return;
        connectPusher({
            channelId,
            pusher,
            setPusher,
            user,
            setMessages,
            setScrollDirection,
            isLive,
        });
        return () => {
            (async () => {
                const authToken = await user.googleUser.getIdToken();
                const pusherId = await getPusher(channelId, authToken);
                pusher?.unbind_all();
                pusher?.unsubscribe(`private-${channelId}-${pusherId}`);
            })();
        };
    }, [channelId, pusher, isLive]);

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
                        {lastMessage ? (
                            loadingOldMessages ? (
                                <div className={styles.padded}>Loading...</div>
                            ) : (
                                <button
                                    className={styles.button}
                                    onClick={async () => {
                                        setLoadingOldMessages(true);
                                        setIsLive(false);
                                        if (
                                            user == "known" ||
                                            user == "unknown"
                                        )
                                            return;
                                        const token =
                                            await user.googleUser.getIdToken();
                                        const { messages: newMessages, last } =
                                            await getChunk(
                                                channelId ?? "",
                                                lastMessage,
                                                token
                                            );
                                        setLastMessage(last);
                                        setMessages((messages) => {
                                            return messages
                                                ? [
                                                      ...newMessages,
                                                      ...messages,
                                                  ].splice(0, 70)
                                                : messages;
                                        });
                                        setLoadingOldMessages(false);
                                    }}
                                >
                                    Load Older Messages
                                </button>
                            )
                        ) : null}
                        {messages.map((message) => {
                            return (
                                <div
                                    key={message.key}
                                    ref={
                                        lastMessage == message.key
                                            ? start
                                            : undefined
                                    }
                                >
                                    <Message
                                        data={message}
                                        useCachedUser={useCachedUser}
                                    />
                                </div>
                            );
                        })}
                        {isLive ? null : (
                            <div>
                                <div className={styles.warning}>
                                    You are viewing message history
                                </div>
                                <button
                                    className={styles.button}
                                    onClick={async () => {
                                        if (
                                            !channelId ||
                                            user == "known" ||
                                            user == "unknown"
                                        )
                                            return;
                                        setLoading(true);
                                        setIsLive(true);
                                        const err = await fetchMessages(
                                            setMessages,
                                            channelId,
                                            user,
                                            setLoading,
                                            setLastMessage
                                        );
                                        if (err) {
                                            displayError({
                                                name: "Error fetching messages",
                                                message: "",
                                                code: err.response,
                                            });
                                        }
                                    }}
                                >
                                    Return to live view
                                </button>
                            </div>
                        )}
                        <div ref={end} />
                    </div>
                    <MessageBox
                        channelId={channelId ?? ""}
                        setMessages={setMessages}
                        setSettings={setSettings}
                        setScroll={setScroll}
                        isLive={isLive}
                    />
                </>
            )}
        </div>
    ) : (
        <div className={styles.padded}>Loading...</div>
    );
};
