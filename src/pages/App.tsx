import { ActionFunctionArgs } from "react-router";
import Columns from "../components/Columns";
import ContentContainer from "../components/ContentContainer";
import Sidebar from "../components/Sidebar";
import { db } from "../server/database/connection";
import { channels } from "../server/database/schema";
import styles from "../styles/Content.module.scss";
import { gidCookie } from "../server/cookies";
import { requireActivatedUser } from "../server/helpers";
import { createChannel } from "../server/repository/channels";
import { z } from "zod";

export function loader() {
  return db.select().from(channels);
}

export default function App() {
  return (
    <Columns>
      <Sidebar />
      <ContentContainer>
        <h1 className={styles.title}>
          Welcome, <span className={styles.logoText}>Zuma</span>
        </h1>
        <p>
          You've been signed in successfully, and your account is fully setup.
          Start chatting!
        </p>
      </ContentContainer>
    </Columns>
  );
}

export async function action({ request }: ActionFunctionArgs) {
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
