import { blacklistUser, UserResult, useXIOUser, whitelistUser } from "../xio";
import styles from "../styles/UserSetting.module.scss";
import { Dispatch, SetStateAction } from "react";
import { CachedUserHook } from "../xio/userCache";

type props = {
    member: string;
    useCachedUser: CachedUserHook;
    setLoading: Dispatch<SetStateAction<boolean>>;
    channelId: string;
    fetchChannelData: () => void;
    blacklisted: boolean;
};

export default ({
    member,
    useCachedUser,
    setLoading,
    channelId,
    fetchChannelData,
    blacklisted,
}: props) => {
    const [user] = useXIOUser();
    const userData = useCachedUser(member);

    return (
        <div key={member}>
            {member} - {userData?.username ?? "Loading..."} -{" "}
            <button
                className={styles.button}
                onClick={async () => {
                    if (user == "known" || user == "unknown") return;
                    setLoading(true);
                    const action = blacklisted ? whitelistUser : blacklistUser;
                    await action(
                        member,
                        channelId,
                        await user.googleUser.getIdToken()
                    );
                    await fetchChannelData();
                    setLoading(false);
                }}
            >
                {blacklisted ? "Whitelist" : "Blacklist"}
            </button>
        </div>
    );
};
