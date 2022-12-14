import { useXIOUser } from "../xio";
import AccountSetup from "./AccountSetup";
import styles from "../styles/Content.module.scss";
import MessageList from "./MessageList";
import Credits from "./Credits";

interface props {
    selected: string | null;
}

export default ({ selected }: props) => {
    const [user] = useXIOUser();
    const loading = <div className={styles.padded}>Loading...</div>;

    return user == "unknown" ? (
        loading
    ) : user == "known" ? (
        <div className={styles.container}>
            <h1>Welcome to XIO</h1>
            <p>Easy to setup, easy to use group chats for all.</p>
            <p>To get started, sign in with google using the button up top.</p>
            <Credits />
        </div>
    ) : user.activated == "activated" ? (
        selected ? (
            <MessageList channelId={selected} />
        ) : (
            <div className={styles.padded}>
                <h1>Welcome, {user.username}</h1>
                <p>
                    You've been signed in successfully, and your account is
                    fully setup. Start chatting!
                </p>
            </div>
        )
    ) : user.activated == "unknown" ? (
        loading
    ) : (
        <AccountSetup />
    );
};
