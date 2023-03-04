import { useEffect, useRef, useState } from "react";
import styles from "../styles/MessageList.module.scss";
import Message from "./Message";
import Pusher from "pusher-js";
import MessageBox from "./MessageBox";
import ChannelSettings from "./ChannelSettings";
import { useUserCache } from "../xio/userCache";
import {
  MessageResult,
  useXIOUser,
  fetchMessages,
  connectPusher,
  getPusher,
  useError,
  useAutoScroll,
} from "../xio";
import LoadOldMessages from "./LoadOldMessages";
import Spinner from "./Spinner";
import Button from "./Button";

interface props {
  channelId: string | null;
}

export default ({ channelId }: props) => {
  const [messages, setMessages] = useState<MessageResult[] | null>(null);
  const [user] = useXIOUser();
  const [loading, setLoading] = useState(false);
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [settings, setSettings] = useState(false);
  const [startId, setStartId] = useState("");
  const useCachedUser = useUserCache();
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [displayError] = useError("Uh oh!");
  const [isConnected, setIsConnected] = useState(false);
  const { setDirection, setScroll, scroll, start, end, direction } =
    useAutoScroll({
      channelId,
      settings,
      messages,
    });

  useEffect(() => {
    setLoading(true);
    setSettings(false);
    setIsLive(true);
  }, [channelId]);

  useEffect(() => {
    console.log("messages updated", messages);
  }, [messages]);

  useEffect(() => {
    if (!channelId || user == "known" || user == "unknown" || !useCachedUser)
      return;
    const error = fetchMessages(
      setMessages,
      channelId,
      user,
      setLoading,
      setLastMessage
    );
    (async () => {
      const err = await error;
      if (err) {
        displayError({
          name: "Error fetching messages",
          message: "",
          code: err.response,
        });
      }
    })();
  }, [channelId]);

  useEffect(() => {
    if (!channelId || user == "known" || user == "unknown") return;
    connectPusher({
      channelId,
      pusher,
      setPusher,
      user,
      setMessages,
      setDirection,
      isLive,
      setIsConnected,
      displayError,
    });
    return () => {
      (async () => {
        const authToken = await user.googleUser.getIdToken();
        const pusherId = await getPusher(channelId, authToken);
        pusher?.unbind_all();
        pusher?.unsubscribe(`private-${channelId}-${pusherId}`);
      })();
    };
  }, [channelId, pusher, isLive]);

  return messages && !loading && useCachedUser ? (
    <div className={styles.container}>
      {settings ? (
        <ChannelSettings
          channelId={channelId ?? ""}
          setSettings={setSettings}
          useCachedUser={useCachedUser}
        />
      ) : (
        <>
          <div
            className={styles.messageList}
            onWheel={({ currentTarget: list }) => {
              if (list.scrollTop == list.scrollHeight - list.offsetHeight) {
                setScroll(true);
              } else {
                setScroll(false);
              }
            }}
          >
            <LoadOldMessages
              lastMessage={lastMessage}
              setIsLive={setIsLive}
              channelId={channelId}
              setStartId={setStartId}
              setDirection={setDirection}
              setLastMessage={setLastMessage}
              setMessages={setMessages}
            />
            {messages.map((message, index) => {
              let subMessage = false;
              if (index > 0) {
                const prev = messages[index - 1];
                const userReq = prev.user == message.user;
                const timeReq = message.timestamp - prev.timestamp < 10 * 60000;
                subMessage = userReq && timeReq;
              }
              return (
                <div
                  key={message.key}
                  ref={startId == message.key ? start : undefined}
                >
                  <Message
                    data={message}
                    useCachedUser={useCachedUser}
                    scroll={scroll}
                    scrollDirection={direction}
                    end={end}
                    subMessage={subMessage}
                  />
                </div>
              );
            })}
            {isLive ? null : (
              <div>
                <div className={styles.warning}>
                  You are viewing message history
                </div>
                <Button
                  onClick={async () => {
                    if (!channelId || user == "known" || user == "unknown")
                      return;
                    setLoading(true);
                    setIsLive(true);
                    setDirection("down");
                    const err = await fetchMessages(
                      setMessages,
                      channelId,
                      user,
                      setLoading,
                      setLastMessage
                    );
                    if (err) {
                      displayError({
                        name: "Error fetching messages",
                        message: "",
                        code: err.response,
                      });
                    }
                  }}
                >
                  Return to live view
                </Button>
              </div>
            )}
            <div className={styles.end} ref={end} />
          </div>
          <MessageBox
            channelId={channelId ?? ""}
            setMessages={setMessages}
            setSettings={setSettings}
            setScroll={setScroll}
            isLive={isLive}
            isConnected={isConnected}
          />
        </>
      )}
    </div>
  ) : (
    <Spinner />
  );
};
