import md5 from "md5";

export * from "./authContext";
export * from "./errorContext";
export * from "./userDB";
export * from "./channelDB";
export * from "./fetchMessages";
export * from "./api";
export * from "./pusher";

export const getGravatar = (email: string) => {
    const hash = md5(email);
    return `https://www.gravatar.com/avatar/${hash}`;
};
