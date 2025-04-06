import { ActionFunctionArgs, Link, redirect, useFetcher } from "react-router";
import TextBox from "../components/TextBox";
import styles from "../styles/AccountSetup.module.scss";
import Button from "../components/Button";
import Columns from "../components/Columns";
import ContentContainer from "../components/ContentContainer";
import { idCookie, pictureCookie } from "../server/cookies";
import { z } from "zod";
import { Route } from "./+types/AccountSetup";
import { getUserById, insertUser } from "../server/repository/users";

export async function loader({ request }: Route.LoaderArgs) {
  const { data: id, success: idExists } = await idCookie.safeParse(request);
  if (!idExists) return redirect("/");
  const user = await getUserById(id);
  if (user !== null) return redirect("/app");
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
  const id = await idCookie.parse(request);
  const picture = await pictureCookie.parse(request);
  const {
    data: name,
    success: nameValid,
    error: nameError,
  } = z
    .string({ message: "Please enter a username" })
    .min(3, "Username must be at least 3 characters long")
    .max(16, "Username must be less than 16 characters long")
    .regex(/^([A-z]|[0-9])+$/g, "Username can only contain letters or numbers")
    .safeParse((await request.formData()).get("username") ?? "");
  if (!nameValid) return nameError.format()._errors;

  try {
    await insertUser({ id, picture, name });
  } catch (_) {
    return ["Sorry! That username is taken"];
  }

  return redirect("/");
}
