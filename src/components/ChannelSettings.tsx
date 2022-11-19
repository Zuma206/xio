import { Dispatch, SetStateAction, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/ChannelSettings.module.scss";
import { deleteChannel, useXIOUser } from "../xio";

type props = {
    channelId: string;
    setSettings: Dispatch<SetStateAction<boolean>>;
};

export default ({ channelId, setSettings }: props) => {
    const [user] = useXIOUser();
    const [deleting, setDeleting] = useState("uncalled");

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
                </button>{" "}
                <span className={styles.title}>Settings - {channelId}</span>
                <div className={styles.padded}>
                    <button className={styles.button}>Unban User1</button>
                    <button className={styles.button}>Unban user2</button>
                    <button className={styles.button}>Unban uSer4</button>
                    <button className={styles.button}>Unban useR6</button>
                    <button className={styles.button}>Unban useR6</button>
                    <button className={styles.button}>Unban useR6</button>
                    <button className={styles.button}>Unban useR6</button>
                    <button className={styles.button}>Unban useR6</button>
                    <button className={styles.button}>Unban useR6</button>
                    <button className={styles.button}>Unban useR6</button>
                    <button className={styles.button}>Unban useR6</button>
                    <button className={styles.button}>Unban useR6</button>
                    <button className={styles.button}>Unban useR6</button>
                </div>
                {deleting == "uncalled" ? (
                    <button
                        onClick={async () => {
                            if (user == "unknown" || user == "known") return;
                            setDeleting("called");
                            await deleteChannel(
                                channelId,
                                await user.googleUser.getIdToken()
                            );
                            setDeleting("finished");
                        }}
                        className={styles.button}
                    >
                        Delete Channel
                    </button>
                ) : deleting == "called" ? (
                    <div>Deleting...</div>
                ) : null}
            </div>
        </div>
    );
};
