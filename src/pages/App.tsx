import styles from "../styles/Content.module.scss";
import background from "../assets/background.svg";
import Columns from "../components/Columns";
import Sidebar from "../components/Sidebar";

export default function App() {
  return (
    <Columns>
      <Sidebar />
      <div
        className={styles.container}
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className={styles.content}>
          <h1 className={styles.title}>
            Welcome, <span className={styles.logoText}>Zuma</span>
          </h1>
          <p>
            You've been signed in successfully, and your account is fully setup.
            Start chatting!
          </p>
        </div>
      </div>
    </Columns>
  );
}
