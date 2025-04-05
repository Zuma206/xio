import { Outlet, useLoaderData } from "react-router";
import Columns from "../components/Columns";
import Sidebar from "../components/Sidebar";
import { requireActivatedUser } from "../server/helpers";
import { getChannels } from "../server/repository/channels";
import { Route } from "./+types/App";
import { authority } from "../server/socktopus";
import { env } from "../server/env";
import { useEffect, useMemo } from "react";
import { SocktopusClient } from "../lib/socktopus";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireActivatedUser(request);
  const [channels, grant] = await Promise.all([
    getChannels(user.id),
    authority(env.SOCKTOPUS_NAME, env.SOCKTOPUS_SECRET).grant(
      user.id.toString()
    ),
  ]);
  return { channels, grant, socktopusURL: env.SOCKTOPUS_ROOT_URL };
}

export default function App() {
  const { grant, socktopusURL } = useLoaderData<typeof loader>();

  const socktopus = useMemo(
    () =>
      new SocktopusClient({
        rootURL: socktopusURL,
        messageListener(data) {
          console.log(data);
        },
      }),
    []
  );

  useEffect(() => {
    socktopus.open(grant);
  }, []);

  return (
    <Columns>
      <Sidebar />
      <Outlet />
    </Columns>
  );
}
