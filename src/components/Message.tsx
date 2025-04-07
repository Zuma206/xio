import { useMemo } from "react";
import styles from "../styles/Message.module.scss";
import type { Message, User } from "../server/database/schema";

type Props = {
  message: Message;
  author: User;
};

export default function Message(props: Props) {
  const dateFormat = useMemo(() => {
    const date = new Date(props.message.date);
    return `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`;
  }, [props.message.date]);

  return (
    <div className={true ? styles.message : styles.clientMessage}>
      <div className={styles.messageContent}>
        <img className={styles.picture} src={props.author.picture} />
        <div>
          <div className={styles.username}>
            {props.author.name}
            <span className={styles.date}> {dateFormat}</span>
          </div>
          <div className={styles.wrap}>{props.message.content}</div>
        </div>
      </div>
    </div>
  );
}
