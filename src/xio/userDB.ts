import { firestore } from "../firebase";
import { collection, doc, getDocs, query, where } from "firebase/firestore";

const usersRef = collection(firestore, "users");

export const getUserById = async (uid: string) => {
    const q = query(usersRef, where("uid", "==", uid));
    const { docs } = await getDocs(q);
    if (docs.length <= 0) return null;
    return docs[0].data();
};
