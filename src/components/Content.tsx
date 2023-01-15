import { ChannelResult, useXIOUser } from "../xio";
import AccountSetup from "./AccountSetup";
import styles from "../styles/Content.module.scss";
import MessageList from "./MessageList";
import Credits from "./Credits";
import Spinner from "./Spinner";

interface props {
  selected: ChannelResult | null;
}

export default ({ selected }: props) => {
  const [user] = useXIOUser();

  return user == "unknown" ? (
    <div className={styles.container}>
      <Spinner />
    </div>
  ) : user == "known" ? (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Welcome to <span className={styles.logoText}>XIO</span>
      </h1>
      <p>
        Easy to setup, easy to use group chats for all.
        <br />
        To get started, sign in with google using the button up top.
      </p>
      <Credits />
    </div>
  ) : user.activated == "activated" ? (
    selected ? (
      <MessageList channelId={selected.key} />
    ) : (
      <div className={styles.padded}>
        <h1>Welcome, {user.username}</h1>
        <p>
          You've been signed in successfully, and your account is fully setup.
          Start chatting!
        </p>
      </div>
    )
  ) : user.activated == "unknown" ? (
    <Spinner />
  ) : (
    <AccountSetup />
  );
};
