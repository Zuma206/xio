import { Dispatch, SetStateAction } from "react";
import { XIOUser } from "./authContext";
import { getMessages, MessageResult } from "./channelDB";
import { getUserById, UserResult } from "./userDB";

export type UserCache = {
    [x: string]: UserResult;
};

export type UserCacheState = [UserCache, Dispatch<SetStateAction<UserCache>>];

export const fetchAndCacheUser = async (
    uid: string,
    setUserCache: Dispatch<SetStateAction<UserCache>>,
    authToken: string
) => {
    const fetchedUser = await getUserById(uid, authToken);
    setUserCache((userCache) => {
        userCache[uid] = fetchedUser;
        return userCache;
    });
};

export const fetchMessages = async (
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>,
    channel: string,
    userCacheState: UserCacheState,
    user: XIOUser,
    setLoading: Dispatch<SetStateAction<boolean>>
) => {
    const [userCache, setUserCache] = userCacheState;

    const messages = await getMessages(
        channel,
        await user.googleUser.getIdToken()
    );

    const doneIds: string[] = [];
    for (let message of messages) {
        if (message.user in doneIds || message.user in userCache) continue;
        await fetchAndCacheUser(
            message.user,
            setUserCache,
            await user.googleUser.getIdToken()
        );
        doneIds.push(message.user);
    }

    setMessages(messages);
    setLoading(false);
};
