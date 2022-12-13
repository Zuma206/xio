import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/Sidebar.module.scss";
import { getUserChannels, useXIOUser, ChannelResult, XIOUser } from "../xio";
import CreateChannel from "./CreateChannel";
import JoinChannel from "./JoinChannel";

interface props {
    setSelected: Dispatch<SetStateAction<null | string>>;
    selected: string | null;
}

export default ({ setSelected, selected }: props) => {
    const [user] = useXIOUser();
    const [channels, setChannels] = useState<ChannelResult[] | null>(null);
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
            <div className={styles.channels}>
                <JoinChannel {...{ loading, setLoading, fetchChannels }} />
                {channels && !loading ? (
                    channels.map((channel, index) => {
                        return channel.key == selected ? (
                            <div
                                key={index}
                                className={styles.selectedOuter}
                                id={channel.key}
                                onClick={(e) => {
                                    setSelected((e.target as HTMLElement).id);
                                }}
                            >
                                <div className={styles.selectedInner}>
                                    {channel.name}
                                </div>
                            </div>
                        ) : (
                            <div
                                key={index}
                                className={styles.channel}
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
            <CreateChannel {...{ loading, setLoading, fetchChannels }} />
        </div>
    ) : null;
};
