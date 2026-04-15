"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [signUp, setSignUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-form-field"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", signUp ? "signUp" : "signIn");
          void signIn("password", formData)
            .catch((error: Error) => {
              const msg = error.message?.includes("Invalid password")
                ? "Invalid password."
                : signUp
                  ? "Could not create account (maybe it already exists)."
                  : "Could not sign in.";
              toast.error(msg);
            })
            .finally(() => setSubmitting(false));
        }}
      >
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {signUp ? "Create account" : "Sign in"}
        </button>
        <button
          type="button"
          className="text-center text-xs text-stone-400 underline-offset-2 hover:text-stone-500 hover:underline"
          onClick={() => setSignUp(!signUp)}
        >
          {signUp ? "Have an account? Sign in" : "New here? Create account"}
        </button>
      </form>
    </div>
  );
}
