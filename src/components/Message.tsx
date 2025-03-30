import styles from "../styles/Message.module.scss";

export default function Message() {
  return (
    <div className={true ? styles.message : styles.clientMessage}>
      <div className={styles.messageContent}>
        <img className={styles.picture} src="" />
        <div>
          <div className={styles.username}>
            Zuma206
            <span className={styles.date}>10 seconds ago</span>
          </div>
          <div className={styles.wrap}>Hello, World!</div>
        </div>
      </div>
    </div>
  );
}
