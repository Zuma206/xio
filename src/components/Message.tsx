import styles from "../styles/Message.module.scss";

type Props = {
  username: string;
  content: string;
};

export default function Message(props: Props) {
  return (
    <div className={true ? styles.message : styles.clientMessage}>
      <div className={styles.messageContent}>
        <img className={styles.picture} src="" />
        <div>
          <div className={styles.username}>
            {props.username}
            <span className={styles.date}>10 seconds ago</span>
          </div>
          <div className={styles.wrap}>{props.content}</div>
        </div>
      </div>
    </div>
  );
}
