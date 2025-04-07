import styles from "../styles/MessageList.module.scss";
import Message from "../components/Message";
import MessageBox from "../components/MessageBox";
import { Route } from "./+types/MessageList";
import { useLoaderData } from "react-router";
import { requireAuth } from "../server/helpers";
import { z } from "zod";
import { getMessages, insertMessage } from "../server/repository/messages";
import { isInChannel } from "../server/repository/channels";

export async function loader({ params }: Route.LoaderArgs) {
  return getMessages(params.channelId);
}

export default function MessageList() {
  const messages = useLoaderData<typeof loader>();

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
  const message = z.string().min(1).max(280).parse(formData.get("message"));
  const userInChannel = await isInChannel(user.id, params.channelId);
  if (!userInChannel) throw new Error("User not in channel");
  await insertMessage({
    channelId: params.channelId,
    authorId: user.id,
    content: message,
  });
}
