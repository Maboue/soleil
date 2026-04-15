import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "motion/react";
import { useState, useRef } from "react";
import { ArtworkWithUrls } from "./Portfolio";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface Props {
  artwork: ArtworkWithUrls;
  adminMode: boolean;
  onClick: () => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
  isDragging?: boolean;
}

export function ArtworkCard({
  artwork,
  adminMode,
  onClick,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(artwork.title);
  const [description, setDescription] = useState(artwork.description ?? "");
  const [size, setSize] = useState(artwork.size ?? "");
  const [price, setPrice] = useState(artwork.price?.toString() ?? "");
  const [sold, setSold] = useState(artwork.sold);

  const updateArtwork = useMutation(api.artworks.update);
  const removeArtwork = useMutation(api.artworks.remove);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    await updateArtwork({
      id: artwork._id,
      title,
      description: description || undefined,
      size: size || undefined,
      price: price ? parseFloat(price) : undefined,
      sold,
    });
    setEditing(false);
    toast.success("Saved");
  };

  const handleImageReplace = async (file: File) => {
    const url = await generateUploadUrl();
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    const { storageId } = await res.json();
    await updateArtwork({ id: artwork._id, imageId: storageId as Id<"_storage"> });
    toast.success("Image updated");
  };

  if (editing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
        <div
          className="aspect-[3/4] bg-gray-50 rounded overflow-hidden cursor-pointer relative group"
          onClick={() => fileRef.current?.click()}
        >
          {artwork.imageUrl && <img src={artwork.imageUrl} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs">Replace image</span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageReplace(e.target.files[0])} />
        </div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm border-b border-gray-200 outline-none py-1 bg-transparent font-medium" placeholder="Title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-xs border-b border-gray-100 outline-none py-1 bg-transparent text-gray-500 resize-none" rows={2} placeholder="Description (optional)" />
        <input value={size} onChange={(e) => setSize(e.target.value)} className="text-xs border-b border-gray-100 outline-none py-1 bg-transparent text-gray-500" placeholder="Size" />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="text-xs border-b border-gray-100 outline-none py-1 bg-transparent text-gray-500" placeholder="Price" />
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
          <input type="checkbox" checked={sold} onChange={(e) => setSold(e.target.checked)} />
          Sold
        </label>
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex-1 py-1.5 bg-black text-white text-xs rounded">Save</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 border border-gray-200 text-xs rounded">Cancel</button>
          <button
            onClick={async () => {
              if (confirm("Delete this artwork?")) {
                await removeArtwork({ id: artwork._id });
                toast.success("Deleted");
              }
            }}
            className="px-3 py-1.5 border border-red-200 text-red-400 text-xs rounded hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={`group relative cursor-pointer rounded-lg overflow-hidden ${isDragging ? "opacity-40 scale-95" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(); }}
      onDrop={onDrop}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="aspect-[3/4] bg-stone-100 overflow-hidden" onClick={onClick}>
        {artwork.imageUrl && (
          <motion.img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {artwork.sold && (
          <div className="absolute top-3 left-3 bg-black/55 text-sm font-light text-white/90 px-3 py-1 rounded-full tracking-[0.22em] uppercase">
            Sold
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none"
      >
        <p className="text-sm font-light tracking-[0.08em] text-white/90">{artwork.title}</p>
        {artwork.price && (
          <p className="text-sm font-light text-white/85 mt-1">
            {artwork.sold ? "Sold" : `€${artwork.price.toLocaleString()}`}
          </p>
        )}
        {artwork.size && <p className="text-sm font-light text-white/85 mt-1">{artwork.size}</p>}
      </motion.div>

      {adminMode && (
        <button
          onClick={(e) => { e.stopPropagation(); setEditing(true); }}
          className="absolute top-2 right-2 bg-white/90 text-black text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
        >
          Edit
        </button>
      )}

      {adminMode && (
        <div className="absolute top-2 left-2 bg-white/70 text-gray-500 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          ⠿
        </div>
      )}
    </motion.div>
  );
}
