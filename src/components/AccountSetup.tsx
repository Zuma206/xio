import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/AccountSetup.module.scss";
import { createUser, useError, useXIOUser } from "../xio";

export default () => {
    const [username, setUsername] = useState("");
    const [user, , setActivationStatus] = useXIOUser();
    const [displayError] = useError("Uh Oh!");
    const [loading, setLoading] = useState(false);

    return loading ? (
        <div className={styles.padded}>Loading...</div>
    ) : (
        <div className={styles.container}>
            <div className={styles.title}>Pick a username!</div>
            <p>Please choose a unique username that:</p>
            <ul>
                <li>Is 3-16 characters</li>
                <li>Contains only letters and numbers</li>
            </ul>
            <input
                placeholder="Username"
                className={styles.text}
                maxLength={16}
                minLength={3}
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
            />
            <p>
                By activating your account you agree to the{" "}
                <Link to="agreement" className={styles.link}>
                    user agreement
                </Link>
            </p>
            <button
                onClick={async () => {
                    if (typeof user == "string") return;
                    setLoading(true);
                    const err = await createUser(
                        username,
                        await user.googleUser.getIdToken()
                    );
                    setLoading(false);
                    if (err) {
                        displayError({
                            name: "There was an error activating your account",
                            code: err.response,
                            message: err.response,
                        });
                        return;
                    }
                    setActivationStatus("unknown");
                }}
                className={styles.button}
            >
                Activate Account
            </button>
        </div>
    );
};
