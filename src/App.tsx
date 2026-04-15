import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Toaster } from "sonner";
import { useState } from "react";
import { Portfolio } from "./Portfolio";
import { AdminBar } from "./AdminBar";

export default function App() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [adminMode, setAdminMode] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Authenticated>
        <AdminBar adminMode={adminMode} setAdminMode={setAdminMode} />
      </Authenticated>
      <Portfolio adminMode={adminMode} />
      <Unauthenticated>
        <div
          id="admin-login"
          className="fixed bottom-6 right-6 z-50"
        >
          <details className="group">
            <summary className="cursor-pointer text-xs text-gray-300 hover:text-gray-500 transition-colors list-none select-none">
              admin
            </summary>
            <div className="absolute bottom-8 right-0 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 mt-2">
              <SignInForm />
            </div>
          </details>
        </div>
      </Unauthenticated>
      <Toaster position="bottom-center" />
    </div>
  );
}
