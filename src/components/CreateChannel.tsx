import { Dispatch, SetStateAction, useState } from "react";
import { createChannel, useError, useXIOUser, XIOUser } from "../xio";
import styles from "../styles/CreateChannel.module.scss";

type props = {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    fetchChannels: (user: XIOUser) => void;
};

export default ({ loading, setLoading, fetchChannels }: props) => {
    const [user] = useXIOUser();
    const [channelName, setChannelName] = useState("");
    const [displayError] = useError("Uh Oh!", setLoading);

    async function submitForm() {
        if (user == "known" || user == "unknown") return;
        setLoading(true);
        const err = await createChannel(
            channelName,
            await user.googleUser.getIdToken()
        );
        if (err) {
            return displayError({
                name: "There was an error creating your channel",
                code: err.response,
                message: err.response,
            });
        }
        setChannelName("");
        await fetchChannels(user);
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
                <input
                    disabled={loading}
                    type="text"
                    className={styles.text}
                    placeholder="Channel Name"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    maxLength={16}
                />
            </form>
            <button
                disabled={loading}
                className={styles.button}
                onClick={submitForm}
            >
                + Create Channel
            </button>
        </div>
    );
};
