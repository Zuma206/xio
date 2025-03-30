import styles from "../styles/MessageList.module.scss";
import Message from "../components/Message";
import MessageBox from "../components/MessageBox";

export default function MessageList() {
  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        <div>
          <Message />
          <Message />
          <Message />
        </div>
      </div>
      <MessageBox />
    </div>
  );
}
