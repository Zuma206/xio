import styles from "../styles/UserProfile.module.scss";

type Props = {
  picture: string;
};

export default function UserProfile(props: Props) {
  return (
    <img
      src={props.picture}
      alt="Profile Picture"
      className={styles.profilePic}
    />
  );
}
