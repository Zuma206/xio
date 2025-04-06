import { Outlet, useLoaderData } from "react-router";
import Columns from "../components/Columns";
import Sidebar from "../components/Sidebar";
import { requireActivatedUser } from "../server/helpers";
import { getChannels } from "../server/repository/channels";
import { Route } from "./+types/App";
import { socktopusAuthority } from "../server/socktopus";
import { env } from "../server/env";
import { useEffect, useState } from "react";
import { SocktopusClient } from "../lib/socktopus";
import { MessageDB, MessageDBContext, messageSchema } from "../lib/messages";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireActivatedUser(request);
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
      messageListener(message) {
        const { data, success } = messageSchema.safeParse(JSON.parse(message));
        if (!success) return;
        setMessageDB((messageDB) => ({
          ...messageDB,
          [data.channel]: [...(messageDB[data.channel] ?? []), data],
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
