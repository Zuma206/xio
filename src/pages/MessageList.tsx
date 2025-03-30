import styles from "../styles/MessageList.module.scss";
import Message from "../components/Message";
import MessageBox from "../components/MessageBox";
import { Route } from "./+types/MessageList";
import { getMessages } from "../server/repository/channels";
import { useLoaderData } from "react-router";

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
              username={message.author.toString()}
              content={message.content}
            />
          ))}
        </div>
      </div>
      <MessageBox />
    </div>
  );
}
