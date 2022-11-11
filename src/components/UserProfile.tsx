import styles from "../styles/UserProfile.module.scss";
import {
    useXIOUser,
    getGravatar,
    useError,
    useLoading,
    getUserById,
    XIOUser,
    UserStatus,
} from "../xio";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";

export default () => {
    const [user, setXIOData] = useXIOUser();
    const [catchError] = useError("Sign In Error");
    const [startLoading, stopLoading] = useLoading();

    const updateUser = async (user: XIOUser | UserStatus) => {
        if (typeof user == "string" || user.activated) return;
        const xioUser = await getUserById(user.googleUser.uid);
        if (!xioUser) return;
        setXIOData(xioUser.username, xioUser.gravatar);
    };

    useEffect(() => {
        updateUser(user);
    }, [user]);

    return user == "unknown" ? (
        "Loading"
    ) : user == "known" ? (
        <button
            className={styles.button}
            onClick={() => {
                startLoading();
                signInWithPopup(auth, new GoogleAuthProvider())
                    .then(stopLoading)
                    .catch(catchError);
            }}
        >
            Sign In
        </button>
    ) : (
        <>
            <button
                className={styles.button}
                onClick={() => {
                    open("https://en.gravatar.com/emails/", "_blank");
                }}
            >
                Gravatar
            </button>
            <button
                className={styles.button}
                onClick={() => {
                    startLoading();
                    auth.signOut().then(stopLoading).catch(catchError);
                }}
            >
                Sign Out
            </button>
            <img
                src={getGravatar(user.googleUser.email ?? "")}
                alt={user.googleUser.displayName ?? "Logged In"}
                className={styles.profilePic}
            />
        </>
    );
};
