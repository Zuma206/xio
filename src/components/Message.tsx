import { useEffect, useState } from "react";
import styles from "../styles/Message.module.scss";
import {
    getUserById,
    CreatedMessage,
    XIOUserResponse,
    useXIOUser,
    XIOUser,
} from "../xio";

interface props {
    data: CreatedMessage;
}

export default ({ data }: props) => {
    const [user] = useXIOUser();
    const [userData, setUserData] = useState<XIOUserResponse | null>(null);

    const fetchUserData = async (user: XIOUser) => {
        const serverUserData = await getUserById(
            data.user,
            await user.googleUser.getIdToken()
        );
        setUserData(serverUserData);
    };

    useEffect(() => {
        if (user == "known" || user == "unknown") return;
        fetchUserData(user);
    }, []);

    return userData ? (
        <div className={styles.message}>
            <img src={userData.gravatar} alt="" className={styles.picture} />
            <div>
                <div className={styles.username}>{userData.username}</div>
                <div className={styles.content}>{data.content}</div>
            </div>
        </div>
    ) : null;
};
