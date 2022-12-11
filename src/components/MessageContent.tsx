import styles from "../styles/MessageContent.module.scss";
import { parseMessage } from "../xio";
import emoji from "node-emoji";

export default ({ content }: { content: string }) => {
    return (
        <div>
            {parseMessage(content).map(({ type, value: token }, index) => {
                switch (type) {
                    case "text":
                        return token;
                    case "link":
                        return (
                            <a key={index} className={styles.link} href={token}>
                                {token}
                            </a>
                        );
                    case "emoji":
                        const emojiToken = token.substring(1, token.length - 1);
                        if (!emoji.hasEmoji(emojiToken)) return token;
                        return emoji.get(emojiToken);
                }
            })}
        </div>
    );
};
