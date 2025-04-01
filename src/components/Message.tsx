import { useMemo } from "react";
import styles from "../styles/Message.module.scss";

type Props = {
  username: string;
  content: string;
  picture: string;
  date: number;
};

export default function Message(props: Props) {
  const dateFormat = useMemo(() => {
    const date = new Date(props.date);
    return `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`;
  }, [props.date]);

  return (
    <div className={true ? styles.message : styles.clientMessage}>
      <div className={styles.messageContent}>
        <img className={styles.picture} src={props.picture} />
        <div>
          <div className={styles.username}>
            {props.username}
            <span className={styles.date}> {dateFormat}</span>
          </div>
          <div className={styles.wrap}>{props.content}</div>
        </div>
      </div>
    </div>
  );
}
