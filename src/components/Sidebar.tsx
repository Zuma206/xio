import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/Sidebar.module.scss";
import {
    createChannel,
    getUserChannels,
    joinChannel,
    useXIOUser,
    ChannelResult,
    XIOUser,
} from "../xio";

interface props {
    setSelected: Dispatch<SetStateAction<null | string>>;
    selected: string | null;
}

export default ({ setSelected, selected }: props) => {
    const [user] = useXIOUser();
    const [channels, setChannels] = useState<ChannelResult[] | null>(null);
    const [joinChannelId, setJoinChannelId] = useState("");
    const [createChannelName, setCreateChannelName] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchChannels = async (userData: XIOUser) => {
        const channelsData = await getUserChannels(
            await userData.googleUser.getIdToken()
        );
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
                    disabled={loading}
                    type="text"
                    className={styles.text}
                    placeholder="Channel Name"
                    value={createChannelName}
                    onChange={(e) => setCreateChannelName(e.target.value)}
                />
                <button
                    disabled={loading}
                    className={styles.button}
                    onClick={async () => {
                        setCreateChannelName("");
                        setLoading(true);
                        await createChannel(
                            createChannelName,
                            await user.googleUser.getIdToken()
                        );
                        await fetchChannels(user);
                        setLoading(false);
                    }}
                >
                    + Create a channel
                </button>
            </div>
            <div className={styles.channels}>
                {channels && !loading ? (
                    channels.map((channel, index) => {
                        return (
                            <div
                                key={index}
                                className={
                                    channel.key === selected
                                        ? styles.channelCurrent
                                        : styles.channel
                                }
                                id={channel.key}
                                onClick={(e) => {
                                    setSelected((e.target as HTMLElement).id);
                                }}
                            >
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
                    disabled={loading}
                    type="text"
                    className={styles.text}
                    placeholder="Channel ID"
                    value={joinChannelId}
                    onChange={(e) => setJoinChannelId(e.target.value)}
                />
                <button
                    disabled={loading}
                    className={styles.button}
                    onClick={async () => {
                        setLoading(true);
                        setJoinChannelId("");
                        await joinChannel(
                            joinChannelId,
                            await user.googleUser.getIdToken()
                        );
                        await fetchChannels(user);
                        setLoading(false);
                    }}
                >
                    + Join Channel
                </button>
            </div>
        </div>
    ) : null;
};
