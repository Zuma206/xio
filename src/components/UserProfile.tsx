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
import Spinner from "./Spinner";
import Button from "./Button";

export default () => {
  const [user, setXIOData, setActivationStatus] = useXIOUser();
  const [loading, setLoading] = useState(false);
  const [displayError] = useError("Sign In Error", setLoading);

  const updateUser = async (user: XIOUser | UserStatus) => {
    try {
      if (typeof user == "string" || user.activated != "unknown") return;
      const xioUser = await getUserById(
        user.googleUser.uid,
        await user.googleUser.getIdToken()
      );
      if (!xioUser) {
        setActivationStatus("unactivated");
        return;
      }
      setXIOData(xioUser.username, xioUser.gravatar);
    } catch (e) {
      displayError({
        name: "Error authenticating on server",
        code: "Failed",
        message: "Failed",
      });
    }
  };

  useEffect(() => {
    updateUser(user);
  }, [user]);

  return user == "unknown" || loading ? (
    <Spinner />
  ) : user == "known" ? (
    <Button
      onClick={() => {
        setLoading(true);
        signInWithPopup(auth, new GoogleAuthProvider())
          .then(() => setLoading(false))
          .catch(displayError);
      }}
    >
      Sign In
    </Button>
  ) : (
    <>
      <Button
        onClick={() => {
          open("https://en.gravatar.com/emails/", "_blank");
        }}
      >
        Gravatar
      </Button>
      <Button
        onClick={() => {
          setLoading(true);
          auth
            .signOut()
            .then(() => setLoading(false))
            .catch(displayError);
        }}
      >
        Sign Out
      </Button>
      <img
        src={getGravatar(user.googleUser.email ?? "")}
        alt={user.googleUser.displayName ?? "Logged In"}
        className={styles.profilePic}
      />
    </>
  );
};
