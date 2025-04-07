import styles from "../styles/HeaderBar.module.scss";
import { PropsWithChildren } from "react";
import logo from "../assets/new.svg";
import { Form, useLoaderData } from "react-router";
import type { loader } from "../root";
import Button from "./Button";
import UserProfile from "./UserProfile";

export default function HeaderBar(props: PropsWithChildren) {
  const user = useLoaderData<typeof loader>();

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <div>
          <img src={logo} alt="XIO" className={styles.logo} />
        </div>
        <div></div>
        <div>
          <Form method="post">
            <Button>Sign {user.id != undefined ? "Out" : "In"}</Button>
          </Form>
          {user.picture !== undefined && <UserProfile picture={user.picture} />}
        </div>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
