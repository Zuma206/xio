import { useXIOUser } from "../xio";
import AccountSetup from "./AccountSetup";
import styles from "../styles/Content.module.scss";
import { useState } from "react";
import MessageList from "./MessageList";

interface props {
    selected: string | null;
}

export default ({ selected }: props) => {
    const [user] = useXIOUser();
    const loading = <div className={styles.padded}>Loading...</div>;

    return user == "unknown" ? (
        loading
    ) : user == "known" ? (
        <div className={styles.padded}>
            <h1>Welcome to XIO</h1>
            <p>To continue, please sign in</p>
        </div>
    ) : user.activated == "activated" ? (
        selected ? (
            <MessageList channelId={selected} />
        ) : (
            <div className={styles.padded}>
                <h1>Welcome, {user.username}</h1>
                <p>
                    You've been signed in successfully, and your account is
                    fully setup
                </p>
            </div>
        )
    ) : user.activated == "unknown" ? (
        loading
    ) : (
        <AccountSetup />
    );
};
