import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { CollectionSection } from "./CollectionSection";
import { ArtworkOverlay } from "./ArtworkOverlay";
import { SiteHeader } from "./SiteHeader";
import { AboutSection } from "./AboutSection";
import { Id } from "../convex/_generated/dataModel";

interface Props {
  adminMode: boolean;
}

export type ArtworkWithUrls = {
  _id: Id<"artworks">;
  _creationTime: number;
  collectionId: Id<"collections">;
  title: string;
  description?: string;
  size?: string;
  price?: number;
  sold: boolean;
  order: number;
  imageId: Id<"_storage">;
  detailImageIds?: Id<"_storage">[];
  slug?: string;
  imageUrl: string | null;
  detailUrls: (string | null)[];
};

export function Portfolio({ adminMode }: Props) {
  const collections = useQuery(api.collections.list) ?? [];
  const [overlayArtwork, setOverlayArtwork] = useState<ArtworkWithUrls | null>(null);
  const createCollection = useMutation(api.collections.create);

  return (
    <div className={adminMode ? "pt-12" : ""}>
      <SiteHeader adminMode={adminMode} />

      <main>
        {/* About section comes first */}
        <AboutSection adminMode={adminMode} />

        {collections.map((collection, i) => (
          <CollectionSection
            key={collection._id}
            collection={collection}
            adminMode={adminMode}
            onArtworkClick={setOverlayArtwork}
            index={i}
          />
        ))}

        {adminMode && (
          <div className="flex justify-center py-16">
            <button
              onClick={() => createCollection({ title: "New Collection" })}
              className="px-8 py-3 border border-dashed border-gray-300 text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-all rounded-full text-sm tracking-widest uppercase"
            >
              + Add Collection
            </button>
          </div>
        )}
      </main>

      <AnimatePresence>
        {overlayArtwork && (
          <ArtworkOverlay
            artwork={overlayArtwork}
            onClose={() => setOverlayArtwork(null)}
          />
        )}
      </AnimatePresence>

      <footer className="py-16 text-center text-xs text-gray-300 tracking-widest uppercase">
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
