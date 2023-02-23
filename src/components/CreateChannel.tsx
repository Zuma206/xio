import { Dispatch, SetStateAction, useState } from "react";
import { createChannel, useError, useXIOUser, XIOUser } from "../xio";
import styles from "../styles/JoinChannel.module.scss";
import Button from "./Button";
import TextBox from "./TextBox";

type props = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  fetchChannels: (user: XIOUser) => void;
};

export default ({ loading, setLoading, fetchChannels }: props) => {
  const [user] = useXIOUser();
  const [channelName, setChannelName] = useState("");
  const [displayError] = useError("Uh Oh!", setLoading);

  async function submitForm() {
    if (user == "known" || user == "unknown") return;
    setLoading(true);
    const err = await createChannel(
      channelName,
      await user.googleUser.getIdToken()
    );
    if (err) {
      return displayError({
        name: "There was an error creating your channel",
        code: err.response,
        message: err.response,
      });
    }
    setChannelName("");
    await fetchChannels(user);
    setLoading(false);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
      >
        <div className={styles.container}>
          <TextBox
            disabled={loading}
            type="text"
            placeholder="Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            maxLength={16}
          />
          <Button disabled={loading}>Create</Button>
        </div>
      </form>
    </div>
  );
};
