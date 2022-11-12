import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    FieldValue,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { XIOUser } from "./authContext";

const channelsRef = collection(firestore, "channels");

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
    timestamp: FieldValue;
}

export interface CreatedMessage extends Message {
    id: string;
}

export const getUserChannels = async (uid: string) => {
    const q = query(channelsRef, where("members", "array-contains", uid));
    const docSnaps = await getDocs(q);
    const channels: CreatedChannel[] = [];
    docSnaps.forEach((docSnap) => {
        channels.push({
            ...docSnap.data(),
            id: docSnap.id,
        } as CreatedChannel);
    });
    return channels;
};

export const validChannelId = async (id: string) => {
    const docRef = doc(channelsRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? true : false;
};

export const joinChannel = async (id: string, userId: string) => {
    const docRef = doc(channelsRef, id);
    return await updateDoc(docRef, {
        members: arrayUnion(userId),
    });
};

export const createChannel = async (name: string, userId: string) => {
    const docRef = doc(channelsRef);
    const channel: Channel = {
        name,
        owners: [userId],
        members: [userId],
        blacklist: [],
    };
    await setDoc(docRef, channel);
};

export const subscribeMessages = async (channelId: string) => {
    const docRef = doc(channelsRef, channelId);
    const collectionRef = collection(docRef, "messages");
    const docsSnap = await getDocs(collectionRef);
    const messages: CreatedMessage[] = [];
    docsSnap.forEach((docSnap) => {
        messages.push({
            id: docSnap.id,
            ...docSnap.data(),
        } as CreatedMessage);
    });
    return messages;
};

export const sendMessage = async (
    channelId: string,
    messageContent: string,
    user: XIOUser
) => {
    const collectionRef = collection(channelsRef, channelId, "messages");
    const data: Message = {
        user: user.googleUser.uid,
        content: messageContent,
        timestamp: serverTimestamp(),
    };
    return await addDoc(collectionRef, data);
};
