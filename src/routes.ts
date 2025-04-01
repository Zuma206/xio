import { index, layout, route, RouteConfig } from "@react-router/dev/routes";

export default [
  index("pages/Index.tsx"),
  route("/agreement", "pages/UserAgreement.tsx"),
  route("/join/:id", "pages/JoinPage.tsx"),
  route("/account-setup", "pages/AccountSetup.tsx"),
  layout("pages/App.tsx", [
    route("/app", "pages/Dashboard.tsx"),
    route("/app/:channelId", "pages/MessageList.tsx"),
  ]),
  route("/api/callback", "server/api/callback.ts"),
  route("/*", "pages/404.tsx"),
] satisfies RouteConfig;
