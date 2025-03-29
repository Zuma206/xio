import styles from "../styles/UserProfile.module.scss";

type Props = {
  picture: string;
  name: string | null;
};

export default function UserProfile(props: Props) {
  return (
    <img
      src={props.picture}
      alt={props.name ?? "Logged In"}
      className={styles.profilePic}
    />
  );
}
