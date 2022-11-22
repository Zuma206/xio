import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/JoinChannel.module.scss";
import { joinChannel, useXIOUser, XIOUser } from "../xio";

type props = {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    fetchChannels: (user: XIOUser) => void;
};

export default ({ loading, setLoading, fetchChannels }: props) => {
    const [user] = useXIOUser();
    const [channelId, setChannelId] = useState("");

    return (
        <div>
            <input
                disabled={loading}
                type="text"
                className={styles.text}
                placeholder="Channel ID"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
            />
            <button
                disabled={loading}
                className={styles.button}
                onClick={async () => {
                    if (user == "known" || user == "unknown") return;
                    setLoading(true);
                    setChannelId("");
                    await joinChannel(
                        channelId,
                        await user.googleUser.getIdToken()
                    );
                    await fetchChannels(user);
                    setLoading(false);
                }}
            >
                + Join Channel
            </button>
        </div>
    );
};
