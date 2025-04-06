import styles from "../styles/Content.module.scss";
import background from "../assets/background.svg";
import Credits from "../components/Credits";
import Columns from "../components/Columns";
import { Route } from "./+types/Index";
import { gidCookie } from "../server/cookies";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const { success } = await gidCookie.safeParse(request);
  if (success) return redirect("/app");
}

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
