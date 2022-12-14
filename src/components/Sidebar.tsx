import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/Sidebar.module.scss";
import { getUserChannels, useXIOUser, ChannelResult, XIOUser } from "../xio";
import CreateChannel from "./CreateChannel";
import JoinChannel from "./JoinChannel";
import sortByProperty, { SortDirections } from "property-sort";
import Credits from "./Credits";

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
        setChannels(
            sortByProperty(channelsData, {
                sortKey: ["name"],
                direction: SortDirections.Ascending,
            })
        );
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
    ) : user == "known" ? (
        <div className={styles.padded}>
            Nothing to see here yet, try signing in.
        </div>
    ) : user.activated == "activated" ? (
        <div className={styles.sidebar}>
            <JoinChannel {...{ loading, setLoading, fetchChannels }} />
            <CreateChannel {...{ loading, setLoading, fetchChannels }} />
            <hr className={styles.divider} />
            <div className={styles.channels}>
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
        </div>
    ) : null;
};
