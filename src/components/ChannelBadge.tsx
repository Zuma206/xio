import { Dispatch, SetStateAction } from "react";
import styles from "../styles/ChannelBadge.module.scss";
import { ChannelResult } from "../xio";

interface Props {
  index: number;
  isSelected: boolean;
  setSelected: Dispatch<SetStateAction<ChannelResult | null>>;
  channel: ChannelResult;
}

export default function ChannelBadge({
  index,
  isSelected,
  setSelected,
  channel,
}: Props) {
  return (
    <div
      key={index}
      className={isSelected ? styles.badgeSelected : styles.badge}
      onClick={(e) => {
        setSelected(isSelected ? null : channel);
      }}
    >
      <div className={styles.text}>{channel.name}</div>
    </div>
  );
}
