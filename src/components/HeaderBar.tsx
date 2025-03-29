import styles from "../styles/HeaderBar.module.scss";
import { PropsWithChildren, use } from "react";
import { AuthContext } from "../lib/auth";
import logo from "../assets/new.svg";
import { Form } from "react-router";
import Button from "./Button";
import UserProfile from "./UserProfile";

export default function HeaderBar(props: PropsWithChildren) {
  const auth = use(AuthContext);

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <div>
          <img src={logo} alt="XIO" className={styles.logo} />
        </div>
        <div></div>
        <div>
          <Form method="post">
            <Button>Sign {auth ? "Out" : "In"}</Button>
          </Form>
          {auth != null && (
            <UserProfile name={auth.name} picture={auth.picture} />
          )}
        </div>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
