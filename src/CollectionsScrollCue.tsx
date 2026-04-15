import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const label =
  "text-sm font-light uppercase tracking-[0.22em] text-stone-500 transition-opacity hover:opacity-60";

function scrollToCollections() {
  document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
}

export function CollectionsScrollCue() {
  const list = useQuery(api.collections.list) ?? [];
  if (list.length === 0) return null;

  return (
    <div className="flex w-full justify-center pt-8 md:pt-10">
      <button type="button" aria-label="Scroll to collections" onClick={scrollToCollections} className={label}>
        <span className="flex flex-col items-center gap-1.5">
          <span>Collections</span>
          <span className="text-xs font-light leading-none text-stone-400" aria-hidden>
            {"\u2193"}
          </span>
        </span>
      </button>
    </div>
  );
}
