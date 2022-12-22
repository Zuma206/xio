import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/MessageList.module.scss";
import { getChunk, MessageResult, useXIOUser } from "../xio";
import Spinner from "./Spinner";

interface Props {
    lastMessage: string | null;
    setIsLive: Dispatch<SetStateAction<boolean>>;
    channelId: string | null;
    setStartId: Dispatch<SetStateAction<string>>;
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>;
    setLastMessage: Dispatch<SetStateAction<string | null>>;
    setDirection: Dispatch<SetStateAction<"up" | "down">>;
}

export default ({
    channelId,
    lastMessage,
    setIsLive,
    setStartId,
    setMessages,
    setLastMessage,
    setDirection,
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [user] = useXIOUser();

    return lastMessage ? (
        loading ? (
            <Spinner />
        ) : (
            <button
                className={styles.button}
                onClick={async () => {
                    setLoading(true);
                    setIsLive(false);
                    if (user == "known" || user == "unknown") return;
                    const token = await user.googleUser.getIdToken();
                    const { messages: newMessages, last } = await getChunk(
                        channelId ?? "",
                        lastMessage,
                        token
                    );
                    setStartId(lastMessage);
                    setLastMessage(last);
                    setDirection("up");
                    setMessages((messages) => {
                        if (!messages) return messages;
                        const newMessageSet = [...newMessages, ...messages];
                        return newMessageSet.splice(0, 70);
                    });
                    setLoading(false);
                }}
            >
                Load Older Messages
            </button>
        )
    ) : null;
};
