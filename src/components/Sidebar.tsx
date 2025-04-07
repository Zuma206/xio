import ChannelForm from "./ChannelForm";
import styles from "../styles/Sidebar.module.scss";
import ChannelBadge from "./ChannelBadge";
import { useLoaderData } from "react-router";

export default function Sidebar() {
  const { channels } = useLoaderData<typeof import("../pages/App").loader>();

  return (
    <div className={styles.sidebar}>
      <div className={styles.box}>
        <ChannelForm
          placeholder="Channel ID"
          name="id"
          buttonText="Join"
          maxLength={13}
          minLength={13}
        />
        <ChannelForm
          placeholder="Channel Name"
          name="name"
          buttonText="Create"
          maxLength={16}
        />
      </div>
      <div className={styles.channels}>
        {channels.map((channel) => (
          <ChannelBadge key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}
