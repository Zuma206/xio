import { Dispatch, SetStateAction } from "react";
import { XIOUser } from "./authContext";
import { getMessages, MessageResult } from "./channelDB";
import { CachedUserHook } from "./userCache";

export const fetchMessages = async (
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>,
    channel: string,
    user: XIOUser,
    setLoading: Dispatch<SetStateAction<boolean>>,
    useCachedUser: CachedUserHook
) => {
    const messages = await getMessages(
        channel,
        await user.googleUser.getIdToken()
    );

    setMessages(messages);
    setLoading(false);
};
