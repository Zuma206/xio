import { useEffect } from "react";
import styles from "../styles/JoinChannel.module.scss";
import Button from "./Button";
import TextBox from "./TextBox";
import { useFetcher } from "react-router";

export default function CreateChannel() {
  const fetcher = useFetcher<typeof import("../pages/App").action>();
  const busy = fetcher.state !== "idle";

  return (
    <div>
      <fetcher.Form
        onSubmit={(e) => {
          const form = e.currentTarget;
          requestAnimationFrame(() => form.reset());
        }}
        method="post"
      >
        <div className={styles.container}>
          <TextBox
            name="name"
            type="text"
            placeholder="Channel Name"
            maxLength={16}
            disabled={busy}
          />
          <Button disabled={busy}>Create</Button>
        </div>
      </fetcher.Form>
      {fetcher.data?.map((error) => (
        <p key={error} style={{ color: "red", maxWidth: "20rem" }}>
          {error}
        </p>
      ))}
    </div>
  );
}
