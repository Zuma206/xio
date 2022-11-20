import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/ChannelSettings.module.scss";
import {
    blacklistUser,
    ChannelResult,
    clearChannel,
    deleteChannel,
    getChannelMemberData,
    getUserById,
    UserCache,
    useXIOUser,
    whitelistUser,
    XIOUser,
} from "../xio";

type props = {
    channelId: string;
    setSettings: Dispatch<SetStateAction<boolean>>;
    userCacheState: [UserCache, Dispatch<SetStateAction<UserCache>>];
};

export default ({ channelId, setSettings, userCacheState }: props) => {
    const [users, setUsers] = userCacheState;
    const [user] = useXIOUser();
    const [deleting, setDeleting] = useState("uncalled");
    const [clearing, setClearing] = useState("uncalled");
    const [loading, setLoading] = useState(false);
    const [dangerZone, setDangerZone] = useState(false);
    const [channelData, setChannelData] = useState<ChannelResult | null>(null);
    const [, reRender] = useState(0);

    useEffect(() => {
        fetchChannelData();
    }, []);

    const fetchChannelData = async () => {
        if (user == "known" || user == "unknown") return;
        const memberData = await getChannelMemberData(
            channelId,
            await user.googleUser.getIdToken()
        );
        setChannelData(memberData);
    };

    const cacheUser = async (user: XIOUser, uid: string) => {
        const authToken = await user.googleUser.getIdToken();
        const userData = await getUserById(uid, authToken);
        setUsers((userCache) => {
            userCache[uid] = userData;
            return userCache;
        });
        reRender((r) => r + 1);
    };

    return (
        <div className={styles.padded}>
            <div>
                <button
                    className={styles.button}
                    onClick={() => {
                        setSettings(false);
                    }}
                >
                    &lt; Back
                </button>
                <p>Channel ID: {channelId}</p>
                {channelData && !loading ? (
                    <div>
                        {channelData.members.map((member) => {
                            if (
                                !(member in users) &&
                                user != "known" &&
                                user != "unknown"
                            ) {
                                cacheUser(user, member);
                            }
                            return (
                                <div key={member}>
                                    {member} -{" "}
                                    {users[member]?.username ?? "Loading..."} -{" "}
                                    <button
                                        className={styles.button}
                                        onClick={async () => {
                                            if (
                                                user == "known" ||
                                                user == "unknown"
                                            )
                                                return;
                                            setLoading(true);
                                            await blacklistUser(
                                                member,
                                                channelId,
                                                await user.googleUser.getIdToken()
                                            );
                                            await fetchChannelData();
                                            setLoading(false);
                                        }}
                                    >
                                        Blacklist
                                    </button>
                                </div>
                            );
                        })}
                        {channelData.blacklist.map((member) => {
                            if (
                                !(member in users) &&
                                user != "known" &&
                                user != "unknown"
                            ) {
                                cacheUser(user, member);
                            }
                            return (
                                <div key={member}>
                                    {member} -{" "}
                                    {users[member]?.username ?? "Loading..."} -{" "}
                                    <button
                                        className={styles.button}
                                        onClick={async () => {
                                            if (
                                                user == "known" ||
                                                user == "unknown"
                                            )
                                                return;
                                            setLoading(true);
                                            await whitelistUser(
                                                member,
                                                channelId,
                                                await user.googleUser.getIdToken()
                                            );
                                            await fetchChannelData();
                                            setLoading(false);
                                        }}
                                    >
                                        Whitelist
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
                <button
                    className={styles.button}
                    onClick={() => {
                        setDangerZone((d) => !d);
                    }}
                >
                    Toggle Danger Buttons
                </button>
                {deleting == "uncalled" ? (
                    <button
                        disabled={!dangerZone}
                        onClick={async () => {
                            if (user == "unknown" || user == "known") return;
                            setDeleting("called");
                            setLoading(true);
                            await deleteChannel(
                                channelId,
                                await user.googleUser.getIdToken()
                            );
                            location.reload();
                        }}
                        className={styles.button}
                    >
                        Delete Channel
                    </button>
                ) : deleting == "called" ? (
                    <div>Deleting...</div>
                ) : null}
                {clearing == "uncalled" && deleting == "uncalled" ? (
                    <button
                        disabled={!dangerZone}
                        onClick={async () => {
                            if (user == "unknown" || user == "known") return;
                            setClearing("called");
                            await clearChannel(
                                channelId,
                                await user.googleUser.getIdToken()
                            );
                            setClearing("finished");
                        }}
                        className={styles.button}
                    >
                        Clear Messages
                    </button>
                ) : clearing == "called" ? (
                    <div>Clearing...</div>
                ) : null}
            </div>
        </div>
    );
};
