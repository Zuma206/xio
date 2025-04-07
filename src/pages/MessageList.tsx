import styles from "../styles/MessageList.module.scss";
import Message from "../components/Message";
import MessageBox from "../components/MessageBox";
import { Route } from "./+types/MessageList";
import { createMessage, getMessages } from "../server/repository/channels.ts";
import { useLoaderData } from "react-router";
import { requireAuth } from "../server/helpers";
import { z } from "zod";

export async function loader({ params }: Route.LoaderArgs) {
  return getMessages(Number(params.channelId));
}

export default function MessageList() {
  const messages = useLoaderData<typeof loader>();

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
  const user = await requireAuth(request);
  const formData = await request.formData();

  const message = z.string().min(1).max(280).parse(formData.get("message"));
  await createMessage(user.id, Number(params.channelId), message);
}
