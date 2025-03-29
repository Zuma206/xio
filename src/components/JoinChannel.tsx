import Button from "./Button";
import TextBox from "./TextBox";
import styles from "../styles/JoinChannel.module.scss";

export default function JoinChannel() {
  return (
    <div>
      <form>
        <div className={styles.container}>
          <TextBox type="text" placeholder="Channel ID" maxLength={16} />
          <Button>Join</Button>
        </div>
      </form>
    </div>
  );
}
