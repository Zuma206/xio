import styles from "../styles/Autocomplete.module.scss";
import Twemoji from "react-twemoji";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { emoji } from "node-emoji";

interface Props {
    input: HTMLInputElement | null;
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
}

export default ({ input, message, setMessage }: Props) => {
    const [selected, setSelected] = useState(0);

    const match = /:([A-z]|[0-9]){2,}$/
        .exec(message ?? "")
        ?.at(0)
        ?.slice(1);

    function triggerAutocomplete(result: string) {
        setMessage((message) => message + result.slice(match?.length) + ": ");
        input?.focus();
    }

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            console.log(e.key);
            if (e.key != "Tab") return;
            e.preventDefault();
            triggerAutocomplete(
                Object.entries(emoji).filter(([name]) =>
                    name.includes(match ?? "")
                )[selected][0]
            );
        };
        input?.addEventListener("keyup", listener);
        return () => {
            input?.removeEventListener("keyup", listener);
        };
    }, []);

    return match ? (
        <div className={styles.autocomplete}>
            <Twemoji options={{ className: styles.emoji }}>
                {Object.entries(emoji)
                    .filter(([name]) => name.includes(match))
                    .map(([name, symbol], index) => {
                        return (
                            <div
                                className={
                                    index != selected
                                        ? styles.listing
                                        : styles.selectedListing
                                }
                                key={name}
                                onClick={() => triggerAutocomplete(name)}
                            >
                                {symbol}&nbsp;{name}
                            </div>
                        );
                    })}
            </Twemoji>
        </div>
    ) : null;
};
