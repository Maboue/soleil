import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "motion/react";
import { useState, useRef } from "react";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkWithUrls } from "./Portfolio";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface CollectionData {
  _id: Id<"collections">;
  title: string;
  description?: string;
  order: number;
  coverImageId?: Id<"_storage">;
  coverUrl?: string | null;
}

interface Props {
  collection: CollectionData;
  adminMode: boolean;
  onArtworkClick: (a: ArtworkWithUrls) => void;
  index: number;
  showCover?: boolean;
  showTopBorder?: boolean;
}

export function CollectionSection({
  collection,
  adminMode,
  onArtworkClick,
  index,
  showCover = true,
  showTopBorder = true,
}: Props) {
  const artworks = useQuery(api.artworks.listByCollection, {
    collectionId: collection._id,
  }) ?? [];

  const updateCollection = useMutation(api.collections.update);
  const removeCollection = useMutation(api.collections.remove);
  const reorderArtworks = useMutation(api.artworks.reorder);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [titleVal, setTitleVal] = useState("");
  const [descVal, setDescVal] = useState("");
  const [draggingId, setDraggingId] = useState<Id<"artworks"> | null>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const dragOverId = useRef<Id<"artworks"> | null>(null);

  const handleDragStart = (id: Id<"artworks">) => setDraggingId(id);
  const handleDragOver = (id: Id<"artworks">) => { dragOverId.current = id; };
  const handleDrop = async () => {
    if (!draggingId || !dragOverId.current || draggingId === dragOverId.current) {
      setDraggingId(null);
      return;
    }
    const ids = artworks.map((a) => a._id);
    const fromIdx = ids.indexOf(draggingId);
    const toIdx = ids.indexOf(dragOverId.current);
    const newIds = [...ids];
    newIds.splice(fromIdx, 1);
    newIds.splice(toIdx, 0, draggingId);
    await reorderArtworks({ collectionId: collection._id, ids: newIds });
    setDraggingId(null);
    dragOverId.current = null;
  };

  const handleCoverUpload = async (file: File) => {
    const url = await generateUploadUrl();
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    const { storageId } = await res.json();
    await updateCollection({ id: collection._id, coverImageId: storageId as Id<"_storage"> });
    toast.success("Cover image updated");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={showTopBorder ? "border-t border-stone-200/80" : ""}
    >
      {/* Cover Image Banner */}
      {showCover && (collection.coverUrl || adminMode) && (
        <div
          className={`relative w-full overflow-hidden ${collection.coverUrl ? "h-64 md:h-96" : "h-32 bg-stone-100"} ${adminMode ? "cursor-pointer group" : ""}`}
          onClick={() => adminMode && coverFileRef.current?.click()}
        >
          {collection.coverUrl ? (
            <img
              src={collection.coverUrl}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-light text-stone-400 tracking-[0.22em] uppercase">
              Click to add cover image
            </div>
          )}
          {adminMode && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-sm font-light text-white/90 tracking-[0.22em] uppercase bg-black/40 px-4 py-2 rounded-full">
                {collection.coverUrl ? "Replace cover" : "Add cover image"}
              </span>
            </div>
          )}
          <input
            ref={coverFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
          />
        </div>
      )}

      <div className="px-8 md:px-16 lg:px-24 py-20 md:py-32">
        {/* Collection Header */}
        <div className="mb-14 md:mb-20 flex items-start justify-between gap-6">
          <div className="flex-1">
            {editingTitle && adminMode ? (
              <input
                autoFocus
                className="text-sm font-light tracking-[0.22em] text-stone-500 uppercase border-b border-stone-200 outline-none bg-transparent w-full"
                value={titleVal}
                onChange={(e) => setTitleVal(e.target.value)}
                onBlur={async () => {
                  await updateCollection({ id: collection._id, title: titleVal });
                  setEditingTitle(false);
                }}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
              />
            ) : (
              <h2
                className={`text-sm font-light tracking-[0.22em] text-stone-500 uppercase ${adminMode ? "cursor-pointer hover:opacity-60 transition-opacity" : ""}`}
                onClick={() => { if (adminMode) { setTitleVal(collection.title); setEditingTitle(true); } }}
              >
                {collection.title}
              </h2>
            )}

            {editingDesc && adminMode ? (
              <textarea
                autoFocus
                className="mt-4 text-sm font-light text-stone-500 leading-relaxed border-b border-stone-200 outline-none bg-transparent w-full resize-none"
                rows={3}
                value={descVal}
                onChange={(e) => setDescVal(e.target.value)}
                onBlur={async () => {
                  await updateCollection({ id: collection._id, description: descVal });
                  setEditingDesc(false);
                }}
              />
            ) : (
              <p
                className={`mt-4 text-sm font-light text-stone-500 leading-relaxed max-w-xl ${adminMode ? "cursor-pointer hover:opacity-60 transition-opacity" : ""} ${!collection.description && !adminMode ? "hidden" : ""}`}
                onClick={() => { if (adminMode) { setDescVal(collection.description ?? ""); setEditingDesc(true); } }}
              >
                {collection.description || (adminMode ? "Click to add description…" : "")}
              </p>
            )}
          </div>

          {adminMode && (
            <button
              onClick={async () => {
                if (confirm("Delete this collection and all its artworks?")) {
                  await removeCollection({ id: collection._id });
                  toast.success("Collection deleted");
                }
              }}
              className="text-xs text-red-400 hover:text-red-600 transition-colors mt-1 shrink-0"
            >
              Delete
            </button>
          )}
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork._id}
              artwork={artwork as ArtworkWithUrls}
              adminMode={adminMode}
              onClick={() => onArtworkClick(artwork as ArtworkWithUrls)}
              draggable={adminMode}
              onDragStart={() => handleDragStart(artwork._id)}
              onDragOver={() => handleDragOver(artwork._id)}
              onDrop={handleDrop}
              isDragging={draggingId === artwork._id}
            />
          ))}

          {adminMode && (
            <AddArtworkCard
              collectionId={collection._id}
              onAdded={() => {}}
            />
          )}
        </div>
      </div>
    </motion.section>
  );
}

function AddArtworkCard({ collectionId, onAdded }: { collectionId: Id<"collections">; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [sold, setSold] = useState(false);
  const [imageId, setImageId] = useState<Id<"_storage"> | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const createArtwork = useMutation(api.artworks.create);

  const handleFile = async (file: File) => {
    setUploading(true);
    const url = await generateUploadUrl();
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    const { storageId } = await res.json();
    setImageId(storageId);
    setImagePreview(URL.createObjectURL(file));
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!imageId || !title) return;
    await createArtwork({
      collectionId,
      title,
      description: description || undefined,
      size: size || undefined,
      price: price ? parseFloat(price) : undefined,
      sold,
      imageId,
    });
    setOpen(false);
    setTitle(""); setDescription(""); setSize(""); setPrice(""); setSold(false);
    setImageId(null); setImagePreview(null);
    toast.success("Artwork added");
    onAdded();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-300 hover:border-gray-400 hover:text-gray-500 transition-all"
      >
        <span className="text-3xl">+</span>
        <span className="text-xs tracking-widest uppercase">Add Artwork</span>
      </button>
    );
  }

  return (
    <div className="aspect-[3/4] border border-gray-200 rounded-lg p-4 flex flex-col gap-3 overflow-y-auto">
      <div
        className="flex-1 bg-gray-50 rounded flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden"
        onClick={() => fileRef.current?.click()}
      >
        {imagePreview ? (
          <img src={imagePreview} className="w-full h-full object-cover rounded" />
        ) : (
          <span className="text-xs text-gray-400">{uploading ? "Uploading…" : "Click to upload image"}</span>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>
      <input placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm border-b border-gray-200 outline-none py-1 bg-transparent" />
      <input placeholder="Size (e.g. 40×50cm)" value={size} onChange={(e) => setSize(e.target.value)} className="text-xs border-b border-gray-100 outline-none py-1 bg-transparent text-gray-500" />
      <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="text-xs border-b border-gray-100 outline-none py-1 bg-transparent text-gray-500" />
      <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
        <input type="checkbox" checked={sold} onChange={(e) => setSold(e.target.checked)} />
        Sold
      </label>
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={!imageId || !title} className="flex-1 py-1.5 bg-black text-white text-xs rounded disabled:opacity-40">Save</button>
        <button onClick={() => setOpen(false)} className="px-3 py-1.5 border border-gray-200 text-xs rounded">Cancel</button>
      </div>
    </div>
  );
}
