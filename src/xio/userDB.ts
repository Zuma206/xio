export type XIOUserResponse = {
    username: string;
    gravatar: string;
    channels: string[];
    key: string;
};

export const getUserById = async (uid: string, authToken: string) => {
    const res = await fetch("api/users/" + uid, {
        headers: { authorization: authToken },
    });
    const { result } = await res.json();
    return result as XIOUserResponse;
};

export const createUser = async (username: string, authToken: string) => {
    await fetch("api/users/activate", {
        headers: {
            authorization: authToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
        method: "POST",
    });
};
