import { useEffect, useState } from "react";

export type UserResult = {
    username: string;
    gravatar: string;
    channels: string[];
    key: string;
};

export const getUserById = async (uid: string, authToken: string) => {
    const res = await fetch("api/users/" + uid, {
        headers: { "X-Token": authToken },
    });
    const { result } = await res.json();
    return result as UserResult;
};

export const createUser = async (username: string, authToken: string) => {
    await fetch("api/users/activate", {
        headers: {
            "X-Token": authToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
        method: "POST",
    });
};
