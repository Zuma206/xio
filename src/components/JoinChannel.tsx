import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/JoinChannel.module.scss";
import { joinChannel, useError, useXIOUser, XIOUser } from "../xio";

type props = {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    fetchChannels: (user: XIOUser) => void;
};

export default ({ loading, setLoading, fetchChannels }: props) => {
    const [user] = useXIOUser();
    const [channelId, setChannelId] = useState("");
    const [displayError] = useError("Uh Oh!");

    async function submitForm() {
        if (user == "known" || user == "unknown") return;
        setLoading(true);
        setChannelId("");
        const joined = await joinChannel(
            channelId,
            await user.googleUser.getIdToken()
        );
        if (joined) {
            await fetchChannels(user);
        } else {
            displayError({
                name: "There was an error joining that channel",
                message: "",
                code: "That channel doesn't exist, is full, or has you blacklisted",
            });
        }
        setLoading(false);
    }

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submitForm();
                }}
            >
                <div className={styles.container}>
                    <input
                        disabled={loading}
                        type="text"
                        className={styles.input}
                        placeholder="Channel ID"
                        value={channelId}
                        onChange={(e) => setChannelId(e.target.value)}
                        maxLength={16}
                    />
                    <button disabled={loading} className={styles.button}>
                        Join
                    </button>
                </div>
            </form>
        </div>
    );
};
