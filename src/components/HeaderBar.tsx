import styles from "../styles/HeaderBar.module.scss";
import { PropsWithChildren } from "react";
import logo from "../assets/new.svg";
import Button from "./Button";
import { Form } from "react-router";

export default function HeaderBar(props: PropsWithChildren) {
  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <div>
          <img src={logo} alt="XIO" className={styles.logo} />
        </div>
        <div></div>
        <div>
          <Form method="post">
            <Button>Sign In</Button>
          </Form>
        </div>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
