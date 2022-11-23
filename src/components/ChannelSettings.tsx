import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/ChannelSettings.module.scss";
import {
    ChannelResult,
    clearChannel,
    deleteChannel,
    getChannelMemberData,
    UserResult,
    useXIOUser,
} from "../xio";
import { CachedUserHook } from "../xio/userCache";
import UserSetting from "./UserSetting";

type props = {
    channelId: string;
    setSettings: Dispatch<SetStateAction<boolean>>;
    useCachedUser: CachedUserHook;
};

export default ({ channelId, setSettings, useCachedUser }: props) => {
    const [user] = useXIOUser();
    const [deleting, setDeleting] = useState("uncalled");
    const [clearing, setClearing] = useState("uncalled");
    const [loading, setLoading] = useState(false);
    const [dangerZone, setDangerZone] = useState(false);
    const [channelData, setChannelData] = useState<ChannelResult | null>(null);

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
                        {channelData.members.map((member) => (
                            <UserSetting
                                {...{
                                    member,
                                    useCachedUser,
                                    setLoading,
                                    channelId,
                                    fetchChannelData,
                                }}
                                blacklisted={false}
                                key={member}
                            />
                        ))}
                        {channelData.blacklist.map((member) => (
                            <UserSetting
                                {...{
                                    member,
                                    useCachedUser,
                                    setLoading,
                                    channelId,
                                    fetchChannelData,
                                }}
                                blacklisted={true}
                                key={member}
                            />
                        ))}
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
