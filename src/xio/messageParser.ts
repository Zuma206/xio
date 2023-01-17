export const parseMessage = (
  message: string
): {
  type: "emoji" | "link" | "text" | "space";
  value: string;
}[] => {
  const emojiRegex = /:[\w\-]+:/;
  const linkRegex = /https?:\/\/\S+/;
  const spaceRegex = / /;
  const tokens = message.split(
    new RegExp(
      `(${emojiRegex.source}|${linkRegex.source}|${spaceRegex.source})`
    )
  );
  return tokens
    .filter((token) => token != "")
    .map((token) => {
      return {
        type: emojiRegex.test(token)
          ? "emoji"
          : linkRegex.test(token)
          ? "link"
          : spaceRegex.test(token)
          ? "space"
          : "text",
        value: token,
      };
    });
};
