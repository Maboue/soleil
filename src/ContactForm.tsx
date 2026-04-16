import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

const fieldClass =
  "w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-light text-stone-600 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400";

export function ContactForm() {
  const send = useAction(api.contact.sendMessage);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await send({ name, email, message });
      toast.success("Message sent. Thank you.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not send.";
      toast.error(msg.replace(/^Uncaught Error:\s*/i, ""));
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-stone-200/80 px-8 py-20 md:px-16 md:py-28 lg:px-24"
    >
      <div className="mx-auto max-w-xl">
        <h2 className="mb-10 text-sm font-light uppercase tracking-[0.22em] text-stone-500">
          Contact
        </h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <input
            className={fieldClass}
            name="name"
            autoComplete="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            required
          />
          <input
            className={fieldClass}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            required
          />
          <textarea
            className={`${fieldClass} min-h-[140px] resize-y`}
            name="message"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={5000}
            required
          />
          <button
            type="submit"
            disabled={sending}
            className="self-start rounded-lg bg-stone-800 px-8 py-3 text-xs font-light uppercase tracking-[0.22em] text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
