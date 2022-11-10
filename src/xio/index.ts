import md5 from "md5";

export * from "./authContext";

export const getGravatar = (email: string) => {
    const hash = md5(email);
    return `https://www.gravatar.com/avatar/${hash}`;
};
