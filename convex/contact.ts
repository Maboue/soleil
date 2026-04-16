import { action } from "./_generated/server";
import { v } from "convex/values";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sendMessage = action({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from =
      process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";

    if (!apiKey?.trim()) {
      throw new Error("Server missing RESEND_API_KEY. Set it in Convex → Settings → Environment Variables.");
    }
    if (!to?.trim()) {
      throw new Error(
        "Server missing CONTACT_TO_EMAIL. Set it in Convex → Settings → Environment Variables.",
      );
    }

    const name = args.name.trim().slice(0, 120);
    const email = args.email.trim().slice(0, 254);
    const message = args.message.trim().slice(0, 5000);

    if (!name || !email || !message) {
      throw new Error("Please fill in every field.");
    }
    if (!emailRx.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from.trim(),
        to: [to.trim()],
        reply_to: [email],
        subject: `Portfolio contact: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend API error:", res.status, body);
      throw new Error("Could not send email. Try again later.");
    }

    return { ok: true as const };
  },
});
