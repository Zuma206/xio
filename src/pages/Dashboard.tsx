import ContentContainer from "../components/ContentContainer";
import styles from "../styles/Content.module.scss";

export default function Dashboard() {
  return (
    <ContentContainer>
      <h1 className={styles.title}>
        Welcome, <span className={styles.logoText}>Zuma</span>
      </h1>
      <p>
        You've been signed in successfully, and your account is fully setup.
        Start chatting!
      </p>
    </ContentContainer>
  );
}
