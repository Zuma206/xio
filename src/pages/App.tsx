import { Outlet, useLoaderData } from "react-router";
import Columns from "../components/Columns";
import Sidebar from "../components/Sidebar";
import { requireAuth } from "../server/helpers";
import { getChannels } from "../server/repository/channels";
import { Route } from "./+types/App";
import { socktopusAuthority } from "../server/socktopus";
import { env } from "../server/env";
import { useEffect, useState } from "react";
import { SocktopusClient } from "../lib/socktopus";
import { JoinedMessage, MessageDB, MessageDBContext } from "../lib/messages";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  return {
    channels: await getChannels(user.id),
    grant: socktopusAuthority.grant(user.id.toString()),
    socktopusURL: env.SOCKTOPUS_ROOT_URL,
  };
}

export default function App() {
  const { grant, socktopusURL } = useLoaderData<typeof loader>();
  const [messageDB, setMessageDB] = useState<MessageDB>({});

  useEffect(() => {
    const socktopus = new SocktopusClient({
      rootURL: socktopusURL,
      messageListener(messageString) {
        const message = JSON.parse(messageString) as JoinedMessage;
        setMessageDB((messageDB) => ({
          ...messageDB,
          [message.messages.channelId]: [
            ...(messageDB[message.messages.channelId] ?? []),
            message,
          ],
        }));
      },
    });
    socktopus.open(grant);
  }, []);

  return (
    <MessageDBContext value={messageDB}>
      <Columns>
        <Sidebar />
        <Outlet />
      </Columns>
    </MessageDBContext>
  );
}
