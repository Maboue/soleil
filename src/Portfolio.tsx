import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArtworkOverlay } from "./ArtworkOverlay";
import { SiteHeader } from "./SiteHeader";
import { Id } from "../convex/_generated/dataModel";
import { Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { CollectionPage } from "./CollectionPage";
import { AboutPage } from "./AboutPage";
import { AdminLoginFooter } from "./AdminLoginFooter";

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
  const [overlayArtwork, setOverlayArtwork] = useState<ArtworkWithUrls | null>(null);
  const createCollection = useMutation(api.collections.create);

  return (
    <div
      className={`mx-auto w-full max-w-7xl ${adminMode ? "pt-12" : ""}`}
    >
      <SiteHeader adminMode={adminMode} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home adminMode={adminMode} />
                {adminMode && (
                  <div className="flex justify-center py-16">
                    <button
                      onClick={() => createCollection({ title: "New Collection" })}
                      className="px-8 py-3 border border-dashed border-stone-300 text-stone-400 hover:border-stone-400 hover:text-stone-500 transition-all rounded-full text-sm font-light tracking-[0.22em] uppercase"
                    >
                      + Add Collection
                    </button>
                  </div>
                )}
              </>
            }
          />
          <Route
            path="/collections/:id"
            element={<CollectionPage adminMode={adminMode} onArtworkClick={setOverlayArtwork} />}
          />
          <Route path="/about" element={<AboutPage adminMode={adminMode} />} />
        </Routes>
      </main>

      <AnimatePresence>
        {overlayArtwork && (
          <ArtworkOverlay
            artwork={overlayArtwork}
            onClose={() => setOverlayArtwork(null)}
          />
        )}
      </AnimatePresence>

      <footer className="px-6 pb-16 pt-20 text-center text-sm font-light text-stone-400 tracking-[0.22em] uppercase">
        <span>© {new Date().getFullYear()}</span>
        <AdminLoginFooter />
      </footer>
    </div>
  );
}
