export const parseMessage = (
    message: string
): {
    type: "emoji" | "link" | "text";
    value: string;
}[] => {
    const emojiRegex = /:\w+:/;
    const linkRegex = /https?:\/\/\S+/;
    const tokens = message.split(
        new RegExp(`(${emojiRegex.source}|${linkRegex.source})`)
    );
    return tokens.map((token) => {
        return {
            type: emojiRegex.test(token)
                ? "emoji"
                : linkRegex.test(token)
                ? "link"
                : "text",
            value: token,
        };
    });
};
