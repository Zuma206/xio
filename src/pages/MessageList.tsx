import styles from "../styles/MessageList.module.scss";
import Message from "../components/Message";
import MessageBox from "../components/MessageBox";
import { Route } from "./+types/MessageList";
import {
  redirect,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
} from "react-router";
import { requireAuth } from "../server/helpers";
import { z } from "zod";
import { use } from "react";
import { JoinedMessage, MessageDBContext } from "../lib/messages";
import { socktopusAuthority } from "../server/socktopus";
import { getMessages, insertMessage } from "../server/repository/messages";
import { isInChannel } from "../server/repository/channels";
import { getUsersInChannel } from "../server/repository/users";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const inChannel = isInChannel(user.id, params.channelId);
  if (!inChannel) throw redirect("/app");
  return getMessages(params.channelId);
}

export const shouldRevalidate = (args: ShouldRevalidateFunctionArgs) =>
  args.currentParams.channelId != args.nextParams.channelId;

export default function MessageList({ params }: Route.ComponentProps) {
  const messageDB = use(MessageDBContext);
  const serverMessages = useLoaderData<typeof loader>();
  const clientMessages = messageDB[params.channelId] ?? [];
  const messages = [...serverMessages, ...clientMessages];

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        <div>
          {messages.map(({ messages, users }) => (
            <Message key={messages.id} message={messages} author={users} />
          ))}
        </div>
      </div>
      <MessageBox />
    </div>
  );
}

export async function action({ request, params }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const formData = await request.formData();
  const content = z.string().min(1).max(280).parse(formData.get("message"));

  const userInChannel = await isInChannel(user.id, params.channelId);
  if (!userInChannel) throw redirect("/app");

  const message = await insertMessage({
    channelId: params.channelId,
    authorId: user.id,
    content,
  });

  (async () => {
    const users = await getUsersInChannel(params.channelId);
    const content = JSON.stringify({
      messages: message,
      users: user,
    } satisfies JoinedMessage);
    await socktopusAuthority.send(
      users.map((user) => ({
        recipient: user.id,
        content,
      }))
    );
  })();
}
