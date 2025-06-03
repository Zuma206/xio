import ContentContainer from "../components/ContentContainer";
import { requireAuth } from "../server/helpers";
import styles from "../styles/Content.module.scss";
import { Route } from "./+types/Dashboard";
import { useLoaderData } from "react-router";
import {
  createChannelAction,
  joinChannelAction,
} from "../server/actions/channels";

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
  switch (formData.get("action")) {
    case "create":
      return createChannelAction(user, formData);
    case "join":
      return joinChannelAction(user, formData);
    default:
      return ["Invalid action"];
  }
}
