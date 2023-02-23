import styles from "../styles/MessageContent.module.scss";
import { parseMessage } from "../xio";
import emoji from "node-emoji";
import { RefObject } from "react";
import Twemoji from "react-twemoji";

interface Props {
  content: string;
  scroll: boolean;
  scrollDirection: "up" | "down";
  end: RefObject<HTMLDivElement>;
}

export default ({ content }: Props) => {
  const parsedMessage = parseMessage(content);
  return (
    <div className={styles.container}>
      <Twemoji
        options={{
          className:
            parsedMessage.length > 1 ? styles.twemoji : styles.bigTwemoji,
        }}
      >
        {parsedMessage.map(({ type, value: token }, index) => {
          switch (type) {
            case "text":
              return token;
            case "space":
              return <span key={index}>&nbsp;</span>;
            case "link":
              return (
                <a
                  key={index}
                  target="_blank"
                  className={styles.link}
                  href={token}
                >
                  {token}
                </a>
              );
            case "emoji":
              const emojiToken = token.substring(1, token.length - 1);
              if (!emoji.hasEmoji(emojiToken)) return token;
              return emoji.get(emojiToken);
          }
        })}
      </Twemoji>
    </div>
  );
};
