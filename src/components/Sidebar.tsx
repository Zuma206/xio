import CreateChannel from "./CreateChannel";
import JoinChannel from "./JoinChannel";
import styles from "../styles/Sidebar.module.scss";
import ChannelBadge from "./ChannelBadge";
import { useLoaderData } from "react-router";

export default function Sidebar() {
  const channels = useLoaderData<typeof import("../pages/App").loader>();

  return (
    <div className={styles.sidebar}>
      <div className={styles.box}>
        <JoinChannel />
        <CreateChannel />
      </div>
      <div className={styles.channels}>
        {channels.map((channel) => (
          <ChannelBadge key={channel.id} name={channel.name} />
        ))}
      </div>
    </div>
  );
}
