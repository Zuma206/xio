import styles from "../styles/HeaderBar.module.scss";
import { PropsWithChildren, use } from "react";
import { AuthContext } from "../lib/auth";
import logo from "../assets/new.svg";
import { Form } from "react-router";
import Button from "./Button";

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
          {auth ? (
            <p>{auth.id}</p>
          ) : (
            <Form method="post">
              <Button>Sign In</Button>
            </Form>
          )}
        </div>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
