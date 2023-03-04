import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/MessageBox.module.scss";
import { MessageResult, sendMessage, useError, useXIOUser } from "../xio";
import { v4 as uuid } from "uuid";
import Spinner from "./Spinner";
import Autocomplete from "./Autocomplete";
import Button from "./Button";

type props = {
  channelId: string;
  setMessages: Dispatch<SetStateAction<MessageResult[] | null>>;
  setSettings: Dispatch<SetStateAction<boolean>>;
  setScroll: Dispatch<SetStateAction<boolean>>;
  isLive: boolean;
  isConnected: boolean;
};

export default ({
  channelId,
  setMessages,
  setSettings,
  setScroll,
  isLive,
  isConnected,
}: props) => {
  const [user] = useXIOUser();
  const [message, setMessage] = useState("");
  const [displayError] = useError("Uh Oh!");

  function deleteClientMessage(messageClientKey: string) {
    setMessages((messages) => {
      if (!messages) return messages;
      return messages.filter((message) => {
        return message.clientKey != messageClientKey;
      });
    });
  }

  return (
    <div className={styles.messageBox}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (user == "known" || user == "unknown") return;
          setMessage("");
          const clientKey = uuid();
          const newMessage: MessageResult = {
            key: uuid(),
            clientKey,
            content: message,
            user: user.googleUser.uid,
            timestamp: Date.now(),
            clientSide: true,
          };
          setScroll(true);
          setMessages((messages: MessageResult[] | null) => {
            if (!messages) return messages;
            return [...messages, newMessage];
          });
          const res = await sendMessage(
            channelId,
            message,
            clientKey,
            await user.googleUser.getIdToken()
          );
          if (res.error) {
            deleteClientMessage(clientKey);
            displayError({
              name: res.error.response,
              code: res.error.message,
              message: res.error.message,
            });
          }
        }}
      >
        {isConnected ? null : <Spinner />}
        <Autocomplete
          message={message}
          setMessage={setMessage}
          disabled={!isLive || !isConnected}
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
        <Button
          onClick={(e) => {
            e.preventDefault();
            setSettings(true);
          }}
        >
          Settings
        </Button>
      </div>
    </div>
  );
};
