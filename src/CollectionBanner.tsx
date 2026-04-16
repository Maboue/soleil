import { Link } from "react-router-dom";
import { Id } from "../convex/_generated/dataModel";
import { cn } from "./lib/utils";

type Collection = {
  _id: Id<"collections">;
  title: string;
  description?: string;
  coverUrl?: string | null;
};

const PLACEHOLDER_TITLE = "New Collection";

function bannerTitle(title: string, showEditorPlaceholders: boolean) {
  const t = title.trim();
  if (showEditorPlaceholders) return t || PLACEHOLDER_TITLE;
  if (!t || t === PLACEHOLDER_TITLE) return null;
  return t;
}

export function CollectionBanner({
  collection,
  isFirst = false,
  adminMode = false,
}: {
  collection: Collection;
  isFirst?: boolean;
  adminMode?: boolean;
}) {
  const titleText = bannerTitle(collection.title, adminMode);
  const desc = collection.description?.trim();
  const hasCaption = Boolean(titleText || desc);

  return (
    <Link
      to={`/collections/${collection._id}`}
      className={cn(
        "group block px-8 md:px-16 lg:px-24 outline-none focus-visible:ring-2 focus-visible:ring-stone-300/80 focus-visible:ring-offset-4 focus-visible:ring-offset-white",
        isFirst ? "py-24 md:py-32 lg:py-36" : "py-20 md:py-28",
      )}
    >
      <article className="mx-auto w-full">
        {collection.coverUrl ? (
          <img
            src={collection.coverUrl}
            alt={titleText ?? "Collection"}
            className="h-auto w-full max-w-full rounded-lg transition-[filter] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.02]"
          />
        ) : (
          <div className="min-h-[10rem]" aria-hidden />
        )}

        {hasCaption && (
          <header className="mt-14 px-1 text-center md:mt-16">
            <div className="mx-auto mb-10 h-px w-[4.5rem] bg-stone-400/45" aria-hidden />
            {titleText && (
              <h2 className="font-collection text-[1.5rem] font-normal leading-[1.2] tracking-[-0.02em] text-stone-800 md:text-[1.6875rem]">
                {titleText}
              </h2>
            )}
            {desc && (
              <p
                className={cn(
                  "mx-auto max-w-md text-[0.9375rem] font-light leading-[1.85] text-stone-600 antialiased",
                  titleText && "mt-6 md:mt-7",
                )}
              >
                {desc}
              </p>
            )}
          </header>
        )}
      </article>
    </Link>
  );
}
