import { index, route, RouteConfig } from "@react-router/dev/routes";

export default [
  index("pages/App.tsx"),
  route("/agreement", "pages/UserAgreement.tsx"),
  route("/join/:id", "pages/JoinPage.tsx"),
  route("*", "pages/404.tsx"),
] satisfies RouteConfig;
