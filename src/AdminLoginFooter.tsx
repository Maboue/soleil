import { Unauthenticated } from "convex/react";
import { SignInForm } from "./SignInForm";

export function AdminLoginFooter() {
  return (
    <Unauthenticated>
      <div className="mt-10 border-t border-stone-100/80 pt-10">
        <details className="group mx-auto max-w-sm text-center">
          <summary className="cursor-pointer list-none text-[10px] font-light uppercase tracking-[0.28em] text-stone-300 transition-colors hover:text-stone-400 select-none">
            Admin
          </summary>
          <div className="mt-5 rounded-xl border border-stone-100 bg-white p-5 text-left shadow-sm">
            <SignInForm />
          </div>
        </details>
      </div>
    </Unauthenticated>
  );
}
