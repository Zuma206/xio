import { z } from "zod";
import ContentContainer from "../components/ContentContainer";
import { requireActivatedUser } from "../server/helpers";
import styles from "../styles/Content.module.scss";
import { Route } from "./+types/Dashboard";
import { getUserById } from "../server/repository/users";
import { idCookie } from "../server/cookies";
import { redirect, useLoaderData } from "react-router";

export function loader({ request }: Route.LoaderArgs) {
  return requireActivatedUser(request);
}

export default function Dashboard() {
  const { name } = useLoaderData<typeof loader>();

  return (
    <ContentContainer>
      <h1 className={styles.title}>
        Welcome, <span className={styles.logoText}>{name}</span>
      </h1>
      <p>
        You've been signed in successfully, and your account is fully setup.
        Start chatting!
      </p>
    </ContentContainer>
  );
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireActivatedUser(request);
  const formData = await request.formData();
  const name = formData.get("name");
  if (name !== null) {
    const result = z
      .string({ message: "Please provide a channel name" })
      .min(3, "Channel names must be at least 3 characters")
      .max(16, "Channel names can be at most 16 characters")
      .regex(
        /^([A-z]|\ |[0-9])+$/g,
        "Channel names can only contain letters, numbers, and spaces"
      )
      .safeParse(name);
    if (!result.success) return result.error.format()._errors;
    const success = await createChannel(user.id, result.data);
    if (!success) return ["You already have 3 channels"];
  }
}
