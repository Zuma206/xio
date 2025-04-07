import { z } from "zod";
import ContentContainer from "../components/ContentContainer";
import { requireAuth } from "../server/helpers";
import styles from "../styles/Content.module.scss";
import { Route } from "./+types/Dashboard";
import { useLoaderData } from "react-router";
import { insertChannel } from "../server/repository/channels";
import { generateId } from "../server/repository/utils";

export function loader({ request }: Route.LoaderArgs) {
  return requireAuth(request);
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
  const user = await requireAuth(request);
  const formData = await request.formData();
  const rawName = formData.get("name");
  const {
    data: name,
    success: nameValid,
    error: nameError,
  } = z
    .string({ message: "Please provide a channel name" })
    .min(3, "Channel names must be at least 3 characters")
    .max(16, "Channel names can be at most 16 characters")
    .regex(
      /^([A-z]|\ |[0-9])+$/g,
      "Channel names can only contain letters, numbers, and spaces"
    )
    .safeParse(rawName);
  if (!nameValid) return nameError.format()._errors;
  const success = await insertChannel({
    ownerId: user.id,
    name,
  });
  if (!success) return ["You already have 3 channels"];
}
