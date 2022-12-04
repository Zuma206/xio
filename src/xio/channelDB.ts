import { fetchAPI } from "./api";

export type ChannelResult = {
    name: string;
    owners: string[];
    blacklist: string[];
    members: string[];
    key: string;
};

export type MessageResult = {
    key: string;
    content: string;
    user: string;
    timestamp: number;
    clientKey?: string;
    clientSide?: boolean;
};

export type ChannelMessagesResult = {
    messages: MessageResult[];
    last: string;
};

export const getUserChannels = async (authToken: string) => {
    const { result } = await fetchAPI("api/channels", authToken);
    return result as ChannelResult[];
};

export const joinChannel = async (channelId: string, userToken: string) => {
    await fetchAPI("api/channels/join", userToken, { channelId });
};

export const createChannel = async (name: string, authToken: string) => {
    const { result } = await fetchAPI("api/channels/create", authToken, {
        name,
    });
    return result;
};

export const getMessages = async (channelId: string, authToken: string) => {
    const { result }: { result: ChannelMessagesResult } = await fetchAPI(
        `api/channels/${channelId}`,
        authToken
    );
    return result;
};

export const sendMessage = async (
    channel: string,
    content: string,
    clientKey: string,
    authToken: string
) => {
    const { result } = await fetchAPI(
        `api/channels/${channel}/message`,
        authToken,
        { content, clientKey }
    );
    return result as MessageResult;
};

export const deleteChannel = async (channelId: string, authToken: string) => {
    const { result } = await fetchAPI(
        `api/channels/${channelId}/delete`,
        authToken
    );
    return result;
};

export const clearChannel = async (channelId: string, authToken: string) => {
    const { result } = await fetchAPI(
        `api/channels/${channelId}/clear`,
        authToken
    );
    return result;
};

export const getChannelMemberData = async (
    channelId: string,
    authToken: string
) => {
    const { result } = await fetchAPI(
        `api/channels/${channelId}/members`,
        authToken
    );
    return result;
};

export const blacklistUser = async (
    targetUserId: string,
    channelId: string,
    authToken: string
) => {
    const { result } = await fetchAPI(
        `api/channels/${channelId}/blacklist`,
        authToken,
        { user: targetUserId }
    );
    return result;
};

export const whitelistUser = async (
    targetUserId: string,
    channelId: string,
    authToken: string
) => {
    const { result } = await fetchAPI(
        `api/channels/${channelId}/whitelist`,
        authToken,
        { user: targetUserId }
    );
    return result;
};

export const getChunk = async (
    channelId: string,
    messageId: string,
    authToken: string
) => {
    const { result }: { result: ChannelMessagesResult } = await fetchAPI(
        `api/channels/${channelId}/${messageId}`,
        authToken
    );
    return result;
};
