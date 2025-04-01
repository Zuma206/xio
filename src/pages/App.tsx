import { Outlet } from "react-router";
import Columns from "../components/Columns";
import Sidebar from "../components/Sidebar";
import { requireActivatedUser } from "../server/helpers";
import { getChannels } from "../server/repository/channels";
import { Route } from "./+types/App";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireActivatedUser(request);
  return getChannels(user.id);
}

export default function App() {
  return (
    <Columns>
      <Sidebar />
      <Outlet />
    </Columns>
  );
}
