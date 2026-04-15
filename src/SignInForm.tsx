"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { toast } from "sonner";

function authFailureMessage(error: unknown, signUp: boolean): string {
  let raw = "";
  if (error instanceof ConvexError) {
    raw = String(error.message ?? "");
    const data = (error as ConvexError<string> & { data?: unknown }).data;
    if (!raw && data !== undefined) raw = JSON.stringify(data);
  } else if (error instanceof Error) {
    raw = error.message;
  } else if (typeof error === "string") {
    raw = error;
  }

  const lower = raw.toLowerCase();
  if (lower.includes("already exists")) {
    return "That email is already registered — use Sign in, or delete the old account in Convex first.";
  }
  if (lower.includes("invalid credentials")) {
    return "Wrong email or password.";
  }
  if (lower.includes("invalid password")) {
    return signUp
      ? "Password must be at least 8 characters."
      : "Wrong email or password.";
  }
  if (raw && raw.length < 200) return raw;
  return signUp ? "Could not create account." : "Could not sign in.";
}

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
            .catch((error: unknown) => {
              toast.error(authFailureMessage(error, signUp));
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
