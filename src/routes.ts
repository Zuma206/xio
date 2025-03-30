import { index, route, RouteConfig } from "@react-router/dev/routes";

export default [
  index("pages/Index.tsx"),
  route("/agreement", "pages/UserAgreement.tsx"),
  route("/join/:id", "pages/JoinPage.tsx"),
  route("/account-setup", "pages/AccountSetup.tsx"),
  route("/app", "pages/App.tsx"),
  route("/api/callback", "server/api/callback.ts"),
  route("/*", "pages/404.tsx"),
] satisfies RouteConfig;
