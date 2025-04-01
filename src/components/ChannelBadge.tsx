import { Dispatch, SetStateAction } from "react";
import styles from "../styles/ChannelBadge.module.scss";
import { ChannelResult } from "../lib";
import { Link, useParams } from "react-router";

type Props = {
  id: number;
  name: string;
};

export default function ChannelBadge(props: Props) {
  const { channelId } = useParams();

  return (
    <Link
      to={`/app/${props.id}`}
      className={
        channelId == props.id.toString() ? styles.badgeSelected : styles.badge
      }
    >
      <div className={styles.text}>{props.name}</div>
    </Link>
  );
}
