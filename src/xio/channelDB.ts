import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { firestore } from "../firebase";

const channelsRef = collection(firestore, "channels");

export interface Channel {
    name: string;
    owners: string[];
    members: string[];
    blacklist: string[];
}

export const getUserChannels = async (uid: string) => {
    const q = query(channelsRef, where("members", "array-contains", uid));
    const docSnaps = await getDocs(q);
    const channels: Channel[] = [];
    docSnaps.forEach((docSnap) => {
        channels.push(docSnap.data() as Channel);
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
