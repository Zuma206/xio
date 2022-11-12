import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/Sidebar.module.scss";
import {
    Channel,
    createChannel,
    getUserChannels,
    joinChannel,
    useXIOUser,
    validChannelId,
    XIOUser,
} from "../xio";

interface props {
    setSelected: Dispatch<SetStateAction<null | string>>;
}

export default ({ setSelected }: props) => {
    const [user] = useXIOUser();
    const [channels, setChannels] = useState<Channel[] | null>(null);
    const [joinChannelId, setJoinChannelId] = useState("");
    const [createChannelName, setCreateChannelName] = useState("");

    const fetchChannels = async (userData: XIOUser) => {
        const channelsData = await getUserChannels(userData.googleUser.uid);
        setChannels(channelsData);
    };

    useEffect(() => {
        if (
            user == "known" ||
            user == "unknown" ||
            user.activated != "activated"
        )
            return;
        fetchChannels(user);
    }, [user]);

    return user == "unknown" ? (
        <div className={styles.padded}>Loading...</div>
    ) : user == "known" ? null : user.activated == "activated" ? (
        <div className={styles.sidebar}>
            <div>
                <input
                    type="text"
                    className={styles.text}
                    placeholder="Channel Name"
                    value={createChannelName}
                    onChange={(e) => setCreateChannelName(e.target.value)}
                />
                <button
                    className={styles.button}
                    onClick={() => {
                        createChannel(createChannelName, user.googleUser.uid);
                        setCreateChannelName("");
                        fetchChannels(user);
                    }}
                >
                    + Create a channel
                </button>
            </div>
            <div className={styles.channels}>
                {channels ? (
                    channels.map((channel, index) => {
                        return (
                            <div key={index} className={styles.channel}>
                                {channel.name}
                            </div>
                        );
                    })
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            <div>
                <input
                    type="text"
                    className={styles.text}
                    placeholder="Channel ID"
                    value={joinChannelId}
                    onChange={(e) => setJoinChannelId(e.target.value)}
                />
                <button
                    className={styles.button}
                    onClick={() => {
                        if (!validChannelId(joinChannelId)) return;
                        joinChannel(joinChannelId, user.googleUser.uid);
                        fetchChannels(user);
                        setJoinChannelId("");
                    }}
                >
                    + Join Channel
                </button>
            </div>
        </div>
    ) : null;
};
