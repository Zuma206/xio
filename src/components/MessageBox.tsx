import { useState } from "react";
import styles from "../styles/MessageBox.module.scss";
import { sendMessage, useXIOUser } from "../xio";

export default ({ channelId }: { channelId: string }) => {
    const [user] = useXIOUser();
    const [message, setMessage] = useState("");

    return (
        <div className={styles.messageBox}>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (user == "known" || user == "unknown") return;
                    setMessage("");
                    await sendMessage(
                        channelId,
                        message,
                        await user.googleUser.getIdToken()
                    );
                }}
            >
                <input
                    className={styles.messageText}
                    type="text"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </form>
        </div>
    );
};
