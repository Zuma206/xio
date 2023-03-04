import { ChannelResult, useXIOUser } from "../xio";
import AccountSetup from "./AccountSetup";
import styles from "../styles/Content.module.scss";
import MessageList from "./MessageList";
import Credits from "./Credits";
import Spinner from "./Spinner";
import background from "../assets/background.svg";

interface props {
  selected: ChannelResult | null;
}

export default ({ selected }: props) => {
  const [user] = useXIOUser();

  return user == "unknown" ? (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${background})` }}
    >
      <Spinner />
    </div>
  ) : user == "known" ? (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.content}>
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
    </div>
  ) : user.activated == "activated" ? (
    selected ? (
      <MessageList channelId={selected.key} />
    ) : (
      <div
        className={styles.container}
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className={styles.content}>
          <h1 className={styles.title}>
            Welcome, <span className={styles.logoText}>{user.username}</span>
          </h1>
          <p>
            You've been signed in successfully, and your account is fully setup.
            Start chatting!
          </p>
        </div>
      </div>
    )
  ) : user.activated == "unknown" ? (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${background})` }}
    >
      <Spinner />
    </div>
  ) : (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.content}>
        <AccountSetup />
      </div>
    </div>
  );
};
