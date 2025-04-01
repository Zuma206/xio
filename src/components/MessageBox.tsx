import { useState } from "react";
import styles from "../styles/MessageBox.module.scss";
import Autocomplete from "./Autocomplete";
import Button from "./Button";
import { useFetcher } from "react-router";

export default function MessageBox() {
  const [message, setMessage] = useState("");
  const fetcher = useFetcher();

  return (
    <div className={styles.messageBox}>
      <fetcher.Form
        method="post"
        onSubmit={() => setTimeout(() => setMessage(""), 0)}
      >
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
      </fetcher.Form>
      <div className={styles.buttons}>
        <Button>Settings</Button>
      </div>
    </div>
  );
}
