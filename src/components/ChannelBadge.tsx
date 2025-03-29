import { Dispatch, SetStateAction } from "react";
import styles from "../styles/ChannelBadge.module.scss";
import { ChannelResult } from "../lib";

export default function ChannelBadge() {
  return (
    <div className={false ? styles.badgeSelected : styles.badge}>
      <div className={styles.text}>Channel</div>
    </div>
  );
}
