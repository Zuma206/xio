import { XIOUser } from "./authContext";

export type XIOChannelResponse = {
    name: string;
    owners: string[];
    blacklist: string[];
    key: string;
};

export const getUserChannels = async (authToken: string) => {
    const res = await fetch("api/channels", {
        headers: { authorization: authToken },
    });
    const { result } = await res.json();
    return result as XIOChannelResponse[];
};

export const joinChannel = async (id: string, userId: string) => {
    return;
};

export const createChannel = async (name: string, authToken: string) => {
    const res = await fetch("api/channels/create", {
        headers: {
            authorization: authToken,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ name }),
    });
    const { result } = await res.json();
    return result;
};

export const subscribeMessages = async (channelId: string) => {
    return [];
};

export const sendMessage = async (
    channelId: string,
    messageContent: string,
    user: any
) => {
    return;
};
