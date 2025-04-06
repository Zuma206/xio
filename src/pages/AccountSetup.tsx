import { ActionFunctionArgs, Link, redirect, useFetcher } from "react-router";
import TextBox from "../components/TextBox";
import styles from "../styles/AccountSetup.module.scss";
import Button from "../components/Button";
import Columns from "../components/Columns";
import ContentContainer from "../components/ContentContainer";
import { idCookie } from "../server/cookies";
import { activateUser } from "../server/repository/users";
import { z } from "zod";
import { getAuthData } from "../server/auth";
import { Route } from "./+types/AccountSetup";

export async function loader({ request }: Route.LoaderArgs) {
  const { data, success } = await idCookie.safeParse(request);
  if (!success) return redirect("/");
  const auth = await getAuthData(data);
  if (auth.name !== null) return redirect("/app");
}

export default function AccountSetup() {
  const fetcher = useFetcher<typeof action>();
  const busy = fetcher.state != "idle";

  return (
    <Columns>
      <div></div>
      <ContentContainer>
        <div className={styles.container}>
          <div className={styles.title}>Pick a username!</div>
          <p>Please choose a unique username that:</p>
          <div>Is 3-16 characters</div>
          <div>Contains only letters and numbers</div>
          <div className={styles.padded} />
          <fetcher.Form method="post">
            <div className={styles.center}>
              <TextBox
                name="username"
                placeholder="Username"
                disabled={busy}
                maxLength={16}
                required
              />
            </div>
            {fetcher.data ? (
              <>
                {fetcher.data.map((error) => (
                  <p style={{ color: "red" }}>{error}</p>
                ))}
              </>
            ) : null}
            <p>
              By activating your account you agree to the{" "}
              <Link to="/agreement" className={styles.link}>
                user agreement
              </Link>
            </p>
            <Button disabled={busy}>Activate Account</Button>
          </fetcher.Form>
        </div>
      </ContentContainer>
    </Columns>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const gid = await idCookie.parse(request);
  const username = z
    .string({ message: "Please enter a username" })
    .min(3, "Username must be at least 3 characters long")
    .max(16, "Username must be less than 16 characters long")
    .regex(/^([A-z]|[0-9])+$/g, "Username can only contain letters or numbers")
    .safeParse((await request.formData()).get("username") ?? "");
  if (username.error) return username.error.format()._errors;
  try {
    await activateUser(gid, username.data);
  } catch (_) {
    return ["Sorry! That username is taken"];
  }
  return redirect("/");
}
