import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { useAuthToken, useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { Toaster, toast } from "sonner";
import { useState, useEffect } from "react";
import { Portfolio } from "./Portfolio";
import { AdminBar } from "./AdminBar";

function clearConvexAuthStorage() {
  for (const key of Object.keys(localStorage)) {
    if (key.includes("__convexAuth")) localStorage.removeItem(key);
  }
}

function SessionNotAcceptedBanner() {
  const token = useAuthToken();
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading || isAuthenticated || token === null) return null;

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[250] rounded-lg border border-amber-200/80 bg-amber-50/95 px-4 py-3 text-sm text-amber-950 shadow-lg md:left-auto md:right-4 md:max-w-md">
      <p className="font-medium">Session not accepted by Convex</p>
      <p className="mt-1 font-light leading-snug">
        Try clearing the stored session and signing in again (common after auth
        changes). If it persists, ensure{" "}
        <span className="font-mono text-xs">convex/auth.config.ts</span>{" "}
        <span className="font-mono text-xs">domain</span> matches your
        deployment&apos;s{" "}
        <span className="font-mono text-xs">CONVEX_SITE_URL</span> (JWT issuer),
        not necessarily this tab&apos;s origin ({origin}).
      </p>
      <button
        type="button"
        className="mt-3 w-full rounded-md border border-amber-800/20 bg-white/80 px-3 py-2 text-xs font-light uppercase tracking-widest text-amber-950 hover:bg-white"
        onClick={() => {
          clearConvexAuthStorage();
          window.location.reload();
        }}
      >
        Clear session &amp; reload
      </button>
    </div>
  );
}

function RejectIfNotAdmin() {
  const isAdmin = useQuery(api.admins.isCurrentUserAdmin);
  const { signOut } = useAuthActions();
  useEffect(() => {
    if (isAdmin !== false) return;
    toast.error("Not an editor — set isAdmin on your user in Convex Data.");
    void signOut();
  }, [isAdmin, signOut]);
  return null;
}

export default function App() {
  const { isAuthenticated } = useConvexAuth();
  const isAdmin = useQuery(api.admins.isCurrentUserAdmin);
  const [adminMode, setAdminMode] = useState(false);

  const canEdit = isAuthenticated && isAdmin === true;

  useEffect(() => {
    if (canEdit) setAdminMode(true);
    else setAdminMode(false);
  }, [canEdit]);

  return (
    <div className="min-h-screen bg-white text-stone-500">
      <SessionNotAcceptedBanner />
      <AuthLoading>
        <div className="pointer-events-none fixed bottom-6 right-6 z-[200] text-sm font-light text-stone-400">
          Checking session…
        </div>
      </AuthLoading>
      <Authenticated>
        <RejectIfNotAdmin />
        {canEdit && (
          <AdminBar adminMode={adminMode} setAdminMode={setAdminMode} />
        )}
      </Authenticated>
      <Portfolio adminMode={canEdit && adminMode} />
      <Toaster position="bottom-center" />
    </div>
  );
}
