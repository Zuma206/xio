import styles from "../styles/JoinChannel.module.scss";
import Button from "./Button";
import TextBox from "./TextBox";
import { useFetcher } from "react-router";
import { onSubmitResetForm } from "../lib/forms";
import type { action } from "../pages/Dashboard";

type Props = {
  placeholder: string;
  name: string;
  maxLength: number;
  minLength?: number;
  buttonText: string;
  action: string;
};

export default function ChannelForm(props: Props) {
  const fetcher = useFetcher<typeof action>();
  const busy = fetcher.state !== "idle";

  return (
    <div>
      <fetcher.Form action="/app" onSubmit={onSubmitResetForm} method="post">
        <div className={styles.container}>
          <TextBox
            name={props.name}
            type="text"
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            minLength={props.minLength}
            disabled={busy}
          />
          <Button disabled={busy}>{props.buttonText}</Button>
        </div>
        <input type="hidden" name="action" value={props.action} />
      </fetcher.Form>
      {fetcher.data?.map((error) => (
        <p key={error} style={{ color: "red", maxWidth: "20rem" }}>
          {error}
        </p>
      ))}
    </div>
  );
}
