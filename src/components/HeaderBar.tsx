import React, { useEffect } from "react";
import styles from "../styles/HeaderBar.module.scss";
import logo from "../assets/xlogo.svg";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { getAuthSetter, useAuth, getGravatar } from "../xio";

export default ({ children }: React.PropsWithChildren) => {
    // get user auth from the client api
    const user = useAuth();
    const setUser = getAuthSetter();

    useEffect(() => {
        // Register listener to keep auth state up to date
        auth.onAuthStateChanged(setUser);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.headerBar}>
                <div>
                    <img src={logo} alt="XIO" className={styles.logo} />
                </div>

                <div></div>

                <div>
                    {/* Check if user is signed in */}
                    {user ? (
                        <>
                            <button
                                className={styles.button}
                                onClick={() => {
                                    open(
                                        "https://en.gravatar.com/emails/",
                                        "_blank"
                                    );
                                }}
                            >
                                Gravatar
                            </button>
                            <button
                                className={styles.button}
                                onClick={() => {
                                    auth.signOut();
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
                                signInWithPopup(auth, new GoogleAuthProvider());
                            }}
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};
