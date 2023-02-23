import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/AccountSetup.module.scss";
import { createUser, useError, useXIOUser } from "../xio";
import Button from "./Button";
import Spinner from "./Spinner";
import TextBox from "./TextBox";

export default () => {
  const [username, setUsername] = useState("");
  const [user, , setActivationStatus] = useXIOUser();
  const [displayError] = useError("Uh Oh!");
  const [loading, setLoading] = useState(false);

  return loading ? (
    <Spinner />
  ) : (
    <div className={styles.container}>
      <div className={styles.title}>Pick a username!</div>
      <p>Please choose a unique username that:</p>
      <div>Is 3-16 characters</div>
      <div>Contains only letters and numbers</div>
      <div className={styles.padded} />
      <div className={styles.center}>
        <TextBox
          placeholder="Username"
          maxLength={16}
          minLength={3}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <p>
        By activating your account you agree to the{" "}
        <Link to="agreement" className={styles.link}>
          user agreement
        </Link>
      </p>
      <Button
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
      >
        Activate Account
      </Button>
    </div>
  );
};
