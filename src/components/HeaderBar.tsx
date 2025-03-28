import styles from "../styles/HeaderBar.module.scss";
import { PropsWithChildren } from "react";
import logo from "../assets/new.svg";
import Button from "./Button";
import { Form, useLoaderData } from "react-router";

export default function HeaderBar(props: PropsWithChildren) {
  const auth = useLoaderData<import("../root").Loader>();

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <div>
          <img src={logo} alt="XIO" className={styles.logo} />
        </div>
        <div></div>
        <div>
          {auth.success ? (
            <p>{auth.data}</p>
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
