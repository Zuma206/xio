import {
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
import { gidCookie, stateCookie } from "./server/cookies";
import { AuthContext } from "./lib/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const idResult = await gidCookie.safeParse(request);
  return {
    auth: idResult.success ? { id: idResult.data } : null,
  };
}

export default function App() {
  const { auth } = useLoaderData<typeof loader>();

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
          <AuthContext value={auth}>
            <HeaderBar>
              <Outlet />
            </HeaderBar>
          </AuthContext>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function action() {
  const { url, state } = createSigninFlow();
  return redirect(url, {
    headers: [
      ["Set-Cookie", await stateCookie(state.key).serialize(state.value)],
    ],
  });
}
