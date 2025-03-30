import { useState } from "react";
import styles from "../styles/MessageBox.module.scss";
import Autocomplete from "./Autocomplete";
import Button from "./Button";

export default function MessageBox() {
  const [message, setMessage] = useState("");

  return (
    <div className={styles.messageBox}>
      <form>
        <Autocomplete
          message={message}
          setMessage={setMessage}
          disabled={false}
        />
        <span
          style={{
            color: `rgb(255, ${255 * (1 - message.length / 350)}, ${
              255 * (1 - message.length / 350)
            })`,
            width: "2em",
          }}
        >
          {280 - message.length}
        </span>
      </form>
      <div className={styles.buttons}>
        <Button>Settings</Button>
      </div>
    </div>
  );
}
