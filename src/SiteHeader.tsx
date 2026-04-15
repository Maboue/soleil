import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { motion } from "motion/react";

interface Props {
  adminMode: boolean;
}

export function SiteHeader({ adminMode }: Props) {
  const artistName = useQuery(api.settings.get, { key: "artistName" }) ?? "Artist Name";
  const tagline = useQuery(api.settings.get, { key: "tagline" }) ?? "";
  const setSetting = useMutation(api.settings.set);

  const [editingName, setEditingName] = useState(false);
  const [editingTagline, setEditingTagline] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [taglineVal, setTaglineVal] = useState("");

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
    >
      {editingName && adminMode ? (
        <input
          autoFocus
          className="text-4xl md:text-6xl font-light tracking-[0.15em] text-center border-b border-gray-300 outline-none bg-transparent w-full max-w-lg mb-2"
          value={nameVal}
          onChange={(e) => setNameVal(e.target.value)}
          onBlur={async () => {
            await setSetting({ key: "artistName", value: nameVal });
            setEditingName(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
        />
      ) : (
        <h1
          className={`text-4xl md:text-6xl font-light tracking-[0.15em] uppercase mb-2 ${adminMode ? "cursor-pointer hover:opacity-60 transition-opacity" : ""}`}
          onClick={() => {
            if (adminMode) {
              setNameVal(artistName ?? "");
              setEditingName(true);
            }
          }}
        >
          {artistName}
        </h1>
      )}

      {editingTagline && adminMode ? (
        <input
          autoFocus
          className="text-sm md:text-base text-gray-400 tracking-widest text-center border-b border-gray-200 outline-none bg-transparent w-full max-w-sm"
          value={taglineVal}
          onChange={(e) => setTaglineVal(e.target.value)}
          onBlur={async () => {
            await setSetting({ key: "tagline", value: taglineVal });
            setEditingTagline(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
        />
      ) : (
        <p
          className={`text-sm md:text-base text-gray-400 tracking-widest uppercase ${adminMode ? "cursor-pointer hover:opacity-60 transition-opacity" : ""} ${!tagline && !adminMode ? "hidden" : ""}`}
          onClick={() => {
            if (adminMode) {
              setTaglineVal(tagline ?? "");
              setEditingTagline(true);
            }
          }}
        >
          {tagline || (adminMode ? "Click to add tagline" : "")}
        </p>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-16 h-px bg-gray-200 mt-8"
      />
    </motion.header>
  );
}
