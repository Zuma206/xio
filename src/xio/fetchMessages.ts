import { Dispatch, SetStateAction } from "react";
import { XIOUser } from "./authContext";
import { getMessages, MessageResult } from "./channelDB";
import { CachedUserHook } from "./userCache";

export const fetchMessages = async (
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>,
    channel: string,
    user: XIOUser,
    setLoading: Dispatch<SetStateAction<boolean>>,
    setLastMessage: Dispatch<SetStateAction<string | null>>
) => {
    const { messages, last } = await getMessages(
        channel,
        await user.googleUser.getIdToken()
    );
    setLastMessage(last);
    setMessages(messages);
    setLoading(false);
};
