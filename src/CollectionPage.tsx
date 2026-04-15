import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { CollectionSection } from "./CollectionSection";
import { ArtworkWithUrls } from "./Portfolio";

export function CollectionPage({
  adminMode,
  onArtworkClick,
}: {
  adminMode: boolean;
  onArtworkClick: (a: ArtworkWithUrls) => void;
}) {
  const { id } = useParams();
  const collection = useQuery(api.collections.get, id ? { id: id as any } : "skip");

  if (collection === null) {
    return (
      <div className="px-8 md:px-16 lg:px-24 py-20">
        <Link to="/" className="text-sm font-light tracking-[0.22em] uppercase text-stone-500 transition-opacity hover:opacity-60">
          ← Back
        </Link>
        <p className="mt-6 text-sm font-light text-stone-500">Collection not found.</p>
      </div>
    );
  }

  if (!collection) return null;

  return (
    <CollectionSection
      collection={collection}
      adminMode={adminMode}
      onArtworkClick={onArtworkClick}
      index={0}
      showCover={adminMode}
      showTopBorder={false}
    />
  );
}

