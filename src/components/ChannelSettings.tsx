import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/ChannelSettings.module.scss";
import {
    ChannelResult,
    clearChannel,
    deleteChannel,
    getChannelMemberData,
    leaveServer,
    useError,
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
    const [displayError] = useError("Uh oh!");

    useEffect(() => {
        fetchChannelData();
    }, []);

    const fetchChannelData = async () => {
        if (user == "known" || user == "unknown") return;
        const { result: memberData, error } = await getChannelMemberData(
            channelId,
            await user.googleUser.getIdToken()
        );
        if (error) {
            displayError({
                name: "Error viewing members",
                message: "",
                code: error.response,
            });
        } else {
            setChannelData(memberData);
        }
    };

    return (
        <div className={styles.padded}>
            <div>
                <div className={styles.buttons}>
                    <button
                        className={styles.button}
                        onClick={() => {
                            setSettings(false);
                        }}
                    >
                        &lt; Back
                    </button>
                    {loading ? null : (
                        <button
                            className={styles.danger}
                            onClick={async () => {
                                if (user == "known" || user == "unknown")
                                    return;
                                setLoading(true);
                                const token =
                                    await user.googleUser.getIdToken();
                                const err = await leaveServer(channelId, token);
                                if (err) {
                                    displayError({
                                        name: "Error leaving channel",
                                        message: "",
                                        code: err.response,
                                    });
                                } else {
                                    location.reload();
                                }
                                setLoading(false);
                            }}
                        >
                            Leave
                        </button>
                    )}
                </div>
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
                    <div className={styles.padded}>Loading...</div>
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
                            const err = await deleteChannel(
                                channelId,
                                await user.googleUser.getIdToken()
                            );
                            if (err) {
                                displayError({
                                    name: "Error deleting channel",
                                    message: "",
                                    code: err.response,
                                });
                                setDeleting("uncalled");
                                setLoading(false);
                            } else {
                                location.reload();
                            }
                        }}
                        className={styles.danger}
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
                            const err = await clearChannel(
                                channelId,
                                await user.googleUser.getIdToken()
                            );
                            if (err) {
                                displayError({
                                    name: "Error clearing channel",
                                    code: err.response,
                                    message: "",
                                });
                                setClearing("uncalled");
                            } else {
                                setClearing("finished");
                            }
                        }}
                        className={styles.danger}
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
