import styles from "../styles/UserProfile.module.scss";
import { useAuth, getGravatar, useError, useLoading } from "../xio";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default () => {
    const user = useAuth();
    const [catchError] = useError("Sign In Error");
    const [startLoading, stopLoading] = useLoading();

    return user ? (
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
                src={getGravatar(user.email ?? "")}
                alt={user.displayName ?? "Logged In"}
                className={styles.profilePic}
            />
        </>
    ) : (
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
    );
};
