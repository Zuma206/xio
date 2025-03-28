import styles from "../styles/Content.module.scss";
import background from "../assets/background.svg";
import Credits from "../components/Credits";
import Columns from "../components/Columns";

export default function Index() {
  return (
    <Columns>
      <div></div>
      <div
        className={styles.container}
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className={styles.content}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.logoText}>XIO</span>
          </h1>
          <p>
            Easy to setup, easy to use group chats for all.
            <br />
            To get started, sign in with google using the button up top.
          </p>
          <Credits />
        </div>
      </div>
    </Columns>
  );
}
