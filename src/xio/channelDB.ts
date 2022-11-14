import { XIOUser } from "./authContext";

export interface Channel {
    name: string;
    owners: string[];
    members: string[];
    blacklist: string[];
}

export interface CreatedChannel extends Channel {
    id: string;
}

export interface Message {
    user: string;
    content: string;
    timestamp: number;
}

export interface CreatedMessage extends Message {
    id: string;
}

export const getUserChannels = async (uid: string) => {
    return [];
};

export const validChannelId = async (id: string) => {
    return true;
};

export const joinChannel = async (id: string, userId: string) => {
    return;
};

export const createChannel = async (name: string, userId: string) => {
    return;
};

export const subscribeMessages = async (channelId: string) => {
    return [];
};

export const sendMessage = async (
    channelId: string,
    messageContent: string,
    user: XIOUser
) => {
    return;
};
