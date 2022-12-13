import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ChannelSettings.module.scss";
import {
    ChannelResult,
    clearChannel,
    deleteChannel,
    getChannelMemberData,
    leaveServer,
    useError,
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
        <div className={styles.container}>
            <div>
                <div className={styles.buttons}>
                    <button
                        className={styles.button}
                        onClick={() => {
                            setSettings(false);
                        }}
                    >
                        Back
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
                <p>
                    <b>Invite Link:</b>{" "}
                    <Link to={`/join/${channelId}`} className={styles.link}>
                        {location.origin}/join/{channelId}
                    </Link>
                </p>
                <p>
                    <b>Channel ID:</b> {channelId}
                </p>
                {!channelData || user == "known" || user == "unknown" ? (
                    <div className={styles.padded}>Loading...</div>
                ) : (
                    <div>
                        {channelData.owners.includes(user.googleUser.uid) ? (
                            <div>
                                <hr />
                                <button
                                    className={styles.button}
                                    onClick={() => {
                                        setDangerZone((d) => !d);
                                    }}
                                >
                                    I {dangerZone ? "don't want" : "want"} to
                                    delete content
                                </button>
                                <div>
                                    {deleting == "uncalled" ? (
                                        <button
                                            disabled={!dangerZone}
                                            onClick={async () => {
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
                                    {clearing == "uncalled" &&
                                    deleting == "uncalled" ? (
                                        <button
                                            disabled={!dangerZone}
                                            onClick={async () => {
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
                                            Delete Messages
                                        </button>
                                    ) : clearing == "called" ? (
                                        <div>Clearing...</div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}
                        <hr />
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
                                        showButton={channelData.owners.includes(
                                            user.googleUser.uid
                                        )}
                                        isOwner={channelData.owners.includes(
                                            member
                                        )}
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
                                        showButton={channelData.owners.includes(
                                            user.googleUser.uid
                                        )}
                                        isOwner={channelData.owners.includes(
                                            member
                                        )}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.padded}>Loading...</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
