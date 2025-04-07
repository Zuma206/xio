import { Dispatch, SetStateAction } from "react";
import styles from "../styles/ChannelBadge.module.scss";
import { ChannelResult } from "../lib";
import { Link, useParams } from "react-router";
import type { Channel } from "../server/database/schema";

type Props = {
  channel: Channel;
};

export default function ChannelBadge(props: Props) {
  const { channelId } = useParams();

  return (
    <Link
      to={`/app/${props.channel.id}`}
      className={
        channelId == props.channel.id ? styles.badgeSelected : styles.badge
      }
    >
      <div className={styles.text}>{props.channel.name}</div>
    </Link>
  );
}
