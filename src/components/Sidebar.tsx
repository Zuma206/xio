import CreateChannel from "./CreateChannel";
import JoinChannel from "./JoinChannel";
import styles from "../styles/Sidebar.module.scss";
import ChannelBadge from "./ChannelBadge";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.box}>
        <JoinChannel />
        <CreateChannel />
      </div>
      <div className={styles.channels}>
        <ChannelBadge />
        <ChannelBadge />
        <ChannelBadge />
        <ChannelBadge />
      </div>
    </div>
  );
}
