import styles from "../styles/Content.module.scss";
import background from "../assets/background.svg";
import { PropsWithChildren } from "react";

export default function ContentContainer(props: PropsWithChildren) {
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
