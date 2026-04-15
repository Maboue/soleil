import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!convexUrl) {
  throw new Error("Missing VITE_CONVEX_URL. Add it to .env (see .env.example).");
}
const convex = new ConvexReactClient(convexUrl);

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const routerBasename = import.meta.env.BASE_URL === "/" ? undefined : basePath;

function authReplaceURL(pathFromAuth: string) {
  const normalized = pathFromAuth.startsWith("/") ? pathFromAuth : `/${pathFromAuth}`;
  if (!basePath || import.meta.env.BASE_URL === "/") {
    window.history.replaceState({}, "", normalized);
    return;
  }
  const href = normalized.startsWith(basePath) ? normalized : `${basePath}${normalized}`;
  window.history.replaceState({}, "", href);
}

createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex} replaceURL={authReplaceURL}>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </ConvexAuthProvider>,
);
