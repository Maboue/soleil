import { useEffect, useRef, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { cn } from "./lib/utils";

const label =
  "text-sm font-light uppercase tracking-[0.22em] text-stone-500 transition-opacity hover:opacity-60";

export function CollectionsNav({ menuAlign = "end" }: { menuAlign?: "center" | "end" }) {
  const list = useQuery(api.collections.list) ?? [];
  const isHome = useMatch({ path: "/", end: true }) !== null;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex items-baseline gap-0.5">
      <button
        type="button"
        className={label}
        onClick={() =>
          isHome
            ? document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })
            : navigate("/")
        }
      >
        Collections
      </button>
      {list.length > 0 && (
        <button
          type="button"
          className={cn(label, "px-0.5 opacity-70")}
          aria-expanded={open}
          aria-label="Show all collections"
          onClick={() => setOpen((o) => !o)}
        >
          {"\u25BE"}
        </button>
      )}
      {open && list.length > 0 && (
        <ul
          className={cn(
            "absolute top-[calc(100%+0.5rem)] z-50 min-w-[12rem] border border-stone-200/80 bg-white py-2 shadow-sm",
            menuAlign === "center" && "left-1/2 -translate-x-1/2",
            menuAlign === "end" && "right-0",
          )}
        >
          {list.map((c) => (
            <li key={c._id}>
              <Link
                to={`/collections/${c._id}`}
                className="block px-4 py-2 text-sm font-light text-stone-500 hover:bg-stone-100/80"
                onClick={() => setOpen(false)}
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
