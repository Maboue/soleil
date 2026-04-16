import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { motion } from "motion/react";
import { Link, useMatch } from "react-router-dom";
import { CollectionsNav } from "./CollectionsNav";
import { CollectionsScrollCue } from "./CollectionsScrollCue";

interface Props {
  adminMode: boolean;
}

export function SiteHeader({ adminMode }: Props) {
  const artistName = useQuery(api.settings.get, { key: "artistName" }) ?? "Soleil Fleming";
  const setSetting = useMutation(api.settings.set);
  const isHome = useMatch({ path: "/", end: true }) !== null;

  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState("");

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={
        isHome
          ? "relative bg-gradient-to-b from-white via-white/90 to-white"
          : "sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md"
      }
    >
      {!isHome && (
        <div className="flex h-20 items-center justify-between px-8 md:px-16 lg:px-24">
          <Link
            to="/"
            className="text-sm font-light uppercase tracking-[0.22em] text-stone-500 transition-opacity hover:opacity-60"
          >
            {artistName}
          </Link>
          <nav className="flex items-center gap-6 text-sm font-light uppercase tracking-[0.22em] text-stone-500">
            <CollectionsNav menuAlign="end" />
            <Link to="/about" className="transition-opacity hover:opacity-60">
              Bio
            </Link>
          </nav>
        </div>
      )}

      {isHome && (
        <div className="px-8 pb-12 pt-12 md:px-16 md:pb-16 md:pt-16 lg:px-24 lg:pb-20">
          <div className="mx-auto max-w-3xl">
            <nav
              className="flex flex-nowrap items-center justify-center gap-16 pb-14 text-sm font-light uppercase tracking-[0.22em] text-stone-500 sm:gap-20 md:gap-24 md:pb-16"
              aria-label="Primary"
            >
              <div className="shrink-0">
                <CollectionsNav menuAlign="center" />
              </div>
              <Link
                to="/about"
                className="shrink-0 whitespace-nowrap text-sm font-light uppercase tracking-[0.22em] text-stone-500 transition-opacity hover:opacity-60"
              >
                Bio
              </Link>
            </nav>

            <div className="flex flex-col items-center gap-12 md:gap-16">
              <div className="w-full text-center">
                {editingName && adminMode ? (
                  <input
                    autoFocus
                    className="mx-auto block w-full max-w-2xl border-b border-stone-200 bg-transparent text-center text-3xl font-light tracking-[0.08em] text-stone-500 outline-none md:text-5xl"
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
                    className={`mx-auto max-w-3xl text-3xl font-light leading-[1.15] tracking-[0.08em] text-stone-500 md:text-5xl ${
                      adminMode ? "cursor-pointer transition-opacity hover:opacity-60" : ""
                    }`}
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
              </div>

              <CollectionsScrollCue />
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
