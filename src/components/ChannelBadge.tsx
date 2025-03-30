import { Dispatch, SetStateAction } from "react";
import styles from "../styles/ChannelBadge.module.scss";
import { ChannelResult } from "../lib";

type Props = {
  name: string;
};

export default function ChannelBadge(props: Props) {
  return (
    <div className={false ? styles.badgeSelected : styles.badge}>
      <div className={styles.text}>{props.name}</div>
    </div>
  );
}
