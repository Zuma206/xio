import { useEffect, useState } from "react";
import styles from "../styles/Message.module.scss";
import { getUserById, Message, XIOUser } from "../xio";

interface props {
    data: Message;
}

export default ({ data }: props) => {
    const [userData, setUserData] = useState<XIOUser | null>(null);

    useEffect(() => {
        (async () => {
            const user = await getUserById(data.user);
            setUserData(user);
        })();
    }, []);

    return userData ? (
        <div className={styles.message}>
            <img
                src={userData.gravatar ?? ""}
                alt=""
                className={styles.picture}
            />
            <div>
                <div className={styles.username}>{userData.username}</div>
                <div className={styles.content}>{data.content}</div>
            </div>
        </div>
    ) : null;
};
