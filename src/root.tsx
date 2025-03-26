import {
  createCookie,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "react-router";
import HeaderBar from "./components/HeaderBar";
import "@fontsource-variable/inter";
import "./styles/Root.scss";
import { createSigninFlow } from "./server/oauth";
import { stateCookie } from "./server/cookies";

export async function action() {
  const { url, state } = createSigninFlow();
  return redirect(url, {
    headers: [
      ["Set-Cookie", await stateCookie(state.key).serialize(state.value)],
    ],
  });
}

export default function App() {
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
