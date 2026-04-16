import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArtworkWithUrls } from "./Portfolio";

interface Props {
  artwork: ArtworkWithUrls;
  onClose: () => void;
}

export function ArtworkOverlay({ artwork, onClose }: Props) {
  const allImages = [
    artwork.imageUrl,
    ...(artwork.detailUrls ?? []),
  ].filter(Boolean) as string[];

  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomed) setZoomed(false);
        else onClose();
        return;
      }
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % allImages.length);
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + allImages.length) % allImages.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [allImages.length, onClose, zoomed]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row text-stone-500"
      onClick={onClose}
    >
      {/* Image area */}
      <div
        className="relative flex min-h-0 flex-1 flex-col bg-stone-100/80 md:min-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
          <div className="flex min-h-full items-center justify-center p-4 md:p-10">
            <motion.img
              key={current}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              src={allImages[current]}
              alt={artwork.title}
              draggable={false}
              onClick={() => setZoomed((z) => !z)}
              className={`select-none object-contain transition-[max-height,max-width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                zoomed
                  ? "max-h-[200vh] max-w-[200vw] cursor-zoom-out"
                  : "max-h-[min(94vh,100dvh)] max-w-full cursor-zoom-in"
              } h-auto w-auto`}
            />
          </div>
        </div>

        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c - 1 + allImages.length) % allImages.length)}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-3xl font-light transition-opacity hover:opacity-80 w-10 h-10 flex items-center justify-center"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c + 1) % allImages.length)}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-3xl font-light transition-opacity hover:opacity-80 w-10 h-10 flex items-center justify-center"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {allImages.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-stone-500 scale-125" : "bg-stone-300"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-72 lg:w-80 bg-white flex flex-col p-8 md:p-10 justify-center border-l border-stone-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-sm font-light tracking-[0.08em] mb-4">{artwork.title}</h2>

        {artwork.description && (
          <p className="text-sm font-light text-stone-500 leading-relaxed mb-8">{artwork.description}</p>
        )}

        <div className="space-y-4 text-sm font-light">
          {artwork.size && (
            <div className="flex justify-between gap-4">
              <span className="text-stone-500 uppercase tracking-[0.22em]">Size</span>
              <span className="text-stone-500 text-right">{artwork.size}</span>
            </div>
          )}
          {artwork.price !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-stone-500 uppercase tracking-[0.22em]">Price</span>
              <span className={artwork.sold ? "line-through text-stone-400 text-right" : "text-stone-500 text-right"}>
                €{artwork.price.toLocaleString()}
              </span>
            </div>
          )}
          {artwork.sold && (
            <div className="flex justify-between gap-4">
              <span className="text-stone-500 uppercase tracking-[0.22em]">Status</span>
              <span className="text-stone-500">Sold</span>
            </div>
          )}
        </div>

        {artwork.slug && (
          <a
            href={`#${artwork.slug}`}
            className="mt-10 text-sm font-light text-stone-500 transition-opacity hover:opacity-60 tracking-[0.22em] uppercase"
          >
            Permalink ↗
          </a>
        )}
      </motion.div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 transition-opacity text-2xl font-light w-10 h-10 flex items-center justify-center"
      >
        ×
      </button>
    </motion.div>
  );
}
