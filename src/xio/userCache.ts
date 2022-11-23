import { useEffect, useRef, useState } from "react";
import { useXIOUser } from "./authContext";
import { getUserById, UserResult } from "./userDB";

export type CachedUserHook = (uid: string) => UserResult | undefined;

export const useUserCache = () => {
    const [user] = useXIOUser();
    if (user == "known" || user == "unknown") return;
    const [users, setUsers] = useState<{
        [x: string]: Promise<UserResult> | UserResult;
    }>({});
    const userCache = useRef(users);

    return (uid: string) => {
        let init = undefined;
        if (uid in userCache.current) {
            init = userCache.current[uid];
            init = init instanceof Promise ? undefined : init;
        }
        const [userData, setUserData] = useState<UserResult | undefined>(init);

        useEffect(() => {
            (async () => {
                if (!(uid in userCache.current)) {
                    const userPromise = user.googleUser
                        .getIdToken()
                        .then((token) => getUserById(uid, token));
                    userCache.current[uid] = userPromise;
                    userPromise.then((res) => {
                        userCache.current[uid] = res;
                    });
                }

                setUserData(await userCache.current[uid]);
            })();
        }, []);

        return userData;
    };
};
