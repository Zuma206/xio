import { Dispatch, SetStateAction, useState } from "react";
import { createChannel, useXIOUser, XIOUser } from "../xio";
import styles from "../styles/CreateChannel.module.scss";

type props = {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    fetchChannels: (user: XIOUser) => void;
};

export default ({ loading, setLoading, fetchChannels }: props) => {
    const [user] = useXIOUser();
    const [channelName, setChannelName] = useState("");

    return (
        <div>
            <input
                disabled={loading}
                type="text"
                className={styles.text}
                placeholder="Channel Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
            />
            <button
                disabled={loading}
                className={styles.button}
                onClick={async () => {
                    if (user == "known" || user == "unknown") return;
                    setChannelName("");
                    setLoading(true);
                    await createChannel(
                        channelName,
                        await user.googleUser.getIdToken()
                    );
                    await fetchChannels(user);
                    setLoading(false);
                }}
            >
                + Create a channel
            </button>
        </div>
    );
};
