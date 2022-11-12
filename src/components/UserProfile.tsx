import styles from "../styles/UserProfile.module.scss";
import {
    useXIOUser,
    getGravatar,
    useError,
    getUserById,
    XIOUser,
    UserStatus,
} from "../xio";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect, useState } from "react";

export default () => {
    const [user, setXIOData, setActivationStatus] = useXIOUser();
    const [catchError] = useError("Sign In Error");
    const [loading, setLoading] = useState(false);

    const updateUser = async (user: XIOUser | UserStatus) => {
        if (typeof user == "string" || user.activated != "unknown") return;
        const xioUser = await getUserById(user.googleUser.uid);
        if (!xioUser) {
            setActivationStatus("unactivated");
            return;
        }
        setXIOData(xioUser.username, xioUser.gravatar);
    };

    useEffect(() => {
        updateUser(user);
    }, [user]);

    return user == "unknown" || loading ? (
        "Loading..."
    ) : user == "known" ? (
        <button
            className={styles.button}
            onClick={() => {
                setLoading(true);
                signInWithPopup(auth, new GoogleAuthProvider())
                    .then(() => setLoading(false))
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
                    setLoading(true);
                    auth.signOut()
                        .then(() => setLoading(false))
                        .catch(catchError);
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
