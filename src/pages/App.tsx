import { ActionFunctionArgs, Outlet } from "react-router";
import Columns from "../components/Columns";
import Sidebar from "../components/Sidebar";
import { requireActivatedUser } from "../server/helpers";
import { createChannel, getChannels } from "../server/repository/channels";
import { z } from "zod";
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

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireActivatedUser(request);
  const formData = await request.formData();
  const name = formData.get("name");
  if (name !== null) {
    const result = z
      .string({ message: "Please provide a channel name" })
      .min(3, "Channel names must be at least 3 characters")
      .max(16, "Channel names can be at most 16 characters")
      .regex(
        /^([A-z]|\ |[0-9])+$/g,
        "Channel names can only contain letters, numbers, and spaces"
      )
      .safeParse(name);
    if (!result.success) return result.error.format()._errors;
    const success = await createChannel(user.id, result.data);
    if (!success) return ["You already have 3 channels"];
  }
}
