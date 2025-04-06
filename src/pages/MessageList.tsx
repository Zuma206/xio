import styles from "../styles/MessageList.module.scss";
import Message from "../components/Message";
import MessageBox from "../components/MessageBox";
import { Route } from "./+types/MessageList";
import {
  createMessage,
  getChannel,
  getMessages,
} from "../server/repository/channels";
import { useLoaderData } from "react-router";
import { requireActivatedUser } from "../server/helpers";
import { z } from "zod";
import { use } from "react";
import { Message as SocketMessage, MessageDBContext } from "../lib/messages";
import { socktopusAuthority } from "../server/socktopus";

export async function loader({ params }: Route.LoaderArgs) {
  return getMessages(Number(params.channelId));
}

export const shouldRevalidate = () => false;

export default function MessageList({ params }: Route.ComponentProps) {
  const messageDB = use(MessageDBContext);
  const serverMessages = useLoaderData<typeof loader>();
  const clientMessages = messageDB[params.channelId] ?? [];
  const messages = [...serverMessages, ...clientMessages];

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        <div>
          {messages.map((message) => (
            <Message
              key={message.id}
              username={message.name}
              content={message.content}
              picture={message.picture}
              date={message.date}
            />
          ))}
        </div>
      </div>
      <MessageBox />
    </div>
  );
}

export async function action({ request, params }: Route.ActionArgs) {
  const user = await requireActivatedUser(request);
  const formData = await request.formData();
  const message = z.string().min(1).max(280).parse(formData.get("message"));
  const channelId = Number(params.channelId);

  const channel = await getChannel(channelId);
  if (!channel) throw new Error("Channel does not exist");
  const { id, date } = await createMessage(user.id, channelId, message);
  socktopusAuthority.send([
    {
      recipient: channel.owner.toString(),
      content: JSON.stringify({
        id: Number(id),
        name: user.name,
        picture: user.picture,
        content: message,
        channel: channelId,
        date,
      } satisfies SocketMessage),
    },
  ]);
}
