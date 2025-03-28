import { Dispatch, SetStateAction } from "react";
import { XIOUser } from "./authContext";
import { getMessages, MessageResult } from "./channelDB";

export const fetchMessages = async (
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>,
    channel: string,
    user: XIOUser,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setLastMessage: Dispatch<SetStateAction<string | null>>
) => {
    const res = await getMessages(channel, await user.googleUser.getIdToken());
    if (!res.error) {
        setLastMessage(res.last);
        setMessages(res.messages);
    }
    setLoading(false);
    return res.error;
};
