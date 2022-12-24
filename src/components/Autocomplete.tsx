import styles from "../styles/Autocomplete.module.scss";
import Twemoji from "react-twemoji";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { emoji } from "node-emoji";

interface Props {
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
    disabled: boolean;
}

const emojiRegex = /:([A-z]|[0-9]){2,}$/;

export default ({ message, setMessage, disabled }: Props) => {
    const [selected, setSelected] = useState(0);
    const [match, setMatch] = useState<string | undefined>(undefined);

    useEffect(() => {
        setMatch(emojiRegex.exec(message)?.at(0)?.slice(1));
    }, [message]);

    useEffect(() => {
        setSelected(0);
    }, [match]);

    const emojis = Object.entries(emoji).filter(([name]) =>
        name.includes(match ?? "")
    );

    function triggerAutocomplete(result: string) {
        if (!match) return;
        setMessage(
            (message) =>
                message.slice(0, message.length - match.length) + result + ": "
        );
    }

    return (
        <>
            {match && emojis.length > 0 ? (
                <div className={styles.autocomplete}>
                    <Twemoji options={{ className: styles.emoji }}>
                        {emojis.map(([name, symbol], index) => {
                            return (
                                <div
                                    className={
                                        index != selected
                                            ? styles.listing
                                            : styles.selectedListing
                                    }
                                    key={name}
                                    onClick={() => triggerAutocomplete(name)}
                                    ref={(target) => {
                                        if (selected != index) return;
                                        target?.scrollIntoView();
                                    }}
                                >
                                    {symbol}&nbsp;{name}
                                </div>
                            );
                        })}
                    </Twemoji>
                </div>
            ) : null}
            <input
                className={styles.messageText}
                type="text"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={disabled}
                minLength={1}
                maxLength={280}
                onKeyDown={(e) => {
                    if (!match) return;
                    if (
                        e.key != "Tab" &&
                        e.key != "ArrowUp" &&
                        e.key != "ArrowDown" &&
                        e.key != "Enter"
                    )
                        return;
                    e.preventDefault();
                    switch (e.key) {
                        case "Tab":
                        case "Enter":
                            triggerAutocomplete(emojis[selected][0]);
                            break;
                        case "ArrowUp":
                            setSelected((s) => (s > 0 ? s - 1 : s));
                            break;
                        case "ArrowDown":
                            setSelected((s) =>
                                s < emojis.length - 1 ? s + 1 : s
                            );
                            break;
                    }
                }}
            />
        </>
    );
};
