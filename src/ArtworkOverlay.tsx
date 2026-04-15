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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % allImages.length);
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + allImages.length) % allImages.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [allImages.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row"
      onClick={onClose}
    >
      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-gray-50"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          key={current}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          src={allImages[current]}
          alt={artwork.title}
          className="max-h-[80vh] max-w-full object-contain"
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((c) => (c - 1 + allImages.length) % allImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 text-3xl transition-colors w-10 h-10 flex items-center justify-center"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % allImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 text-3xl transition-colors w-10 h-10 flex items-center justify-center"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-gray-700 scale-125" : "bg-gray-300"}`}
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
        className="w-full md:w-72 lg:w-80 bg-white flex flex-col p-8 md:p-10 justify-center border-l border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-light tracking-wide mb-2">{artwork.title}</h2>

        {artwork.description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{artwork.description}</p>
        )}

        <div className="space-y-3 text-sm">
          {artwork.size && (
            <div className="flex justify-between">
              <span className="text-gray-400 uppercase tracking-widest text-xs">Size</span>
              <span className="text-gray-700">{artwork.size}</span>
            </div>
          )}
          {artwork.price !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-400 uppercase tracking-widest text-xs">Price</span>
              <span className={artwork.sold ? "line-through text-gray-400" : "text-gray-700"}>
                €{artwork.price.toLocaleString()}
              </span>
            </div>
          )}
          {artwork.sold && (
            <div className="flex justify-between">
              <span className="text-gray-400 uppercase tracking-widest text-xs">Status</span>
              <span className="text-gray-500">Sold</span>
            </div>
          )}
        </div>

        {artwork.slug && (
          <a
            href={`#${artwork.slug}`}
            className="mt-8 text-xs text-gray-400 hover:text-gray-600 transition-colors tracking-widest uppercase"
          >
            Permalink ↗
          </a>
        )}
      </motion.div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors text-2xl w-10 h-10 flex items-center justify-center"
      >
        ×
      </button>
    </motion.div>
  );
}
