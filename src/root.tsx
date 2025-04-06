import {
  ActionFunctionArgs,
  data,
  Links,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import HeaderBar from "./components/HeaderBar";
import "@fontsource-variable/inter";
import "./styles/Root.scss";
import { createSigninFlow } from "./server/oauth";
import { idCookie, pictureCookie, stateCookie } from "./server/cookies";
import { getUserById } from "./server/repository/users";

export async function loader({ request }: LoaderFunctionArgs) {
  const { data: id, success: idExists } = await idCookie.safeParse(request);
  if (!idExists) return {};
  const user = await getUserById(id);
  if (!user) return { id, picture: await pictureCookie.parse(request) };
  return user;
}

export default function App() {
  const auth = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="new.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>XIO</title>
        <link rel="manifest" href="manifest.json" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">
          <HeaderBar>
            <Outlet />
          </HeaderBar>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  if ((await idCookie.safeParse(request)).success) {
    return data(undefined, {
      headers: [["Set-Cookie", await idCookie.serialize("", { maxAge: 0 })]],
    });
  } else {
    const { url, state } = createSigninFlow();
    return redirect(url, {
      headers: [
        ["Set-Cookie", await stateCookie(state.key).serialize(state.value)],
      ],
    });
  }
}
