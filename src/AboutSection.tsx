import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "motion/react";
import { useState, useRef } from "react";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface Props {
  adminMode: boolean;
}

export function AboutSection({ adminMode }: Props) {
  const aboutText = useQuery(api.settings.get, { key: "aboutText" });
  const aboutImageId = useQuery(api.settings.get, { key: "aboutImageId" });
  const aboutImageUrl = useQuery(
    api.storage.getUrl,
    aboutImageId ? { storageId: aboutImageId as Id<"_storage"> } : "skip"
  );

  const setSetting = useMutation(api.settings.set);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [editing, setEditing] = useState(false);
  const [textVal, setTextVal] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    const url = await generateUploadUrl();
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    const { storageId } = await res.json();
    await setSetting({ key: "aboutImageId", value: storageId });
    toast.success("Photo updated");
  };

  // Don't render if no content and not in admin mode
  if (!adminMode && !aboutText && !aboutImageUrl) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="px-8 md:px-16 lg:px-24 py-20 md:py-32"
    >
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">
        {/* Photo */}
        <div
          className={`shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-stone-100 ${adminMode ? "cursor-pointer group relative" : ""}`}
          onClick={() => adminMode && fileRef.current?.click()}
        >
          {aboutImageUrl ? (
            <img src={aboutImageUrl} alt="Artist" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-light text-stone-400 tracking-[0.22em] uppercase text-center px-4">
              {adminMode ? "Click to add photo" : ""}
            </div>
          )}
          {adminMode && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              <span className="text-sm font-light text-white/90 tracking-[0.22em] uppercase">
                {aboutImageUrl ? "Replace" : "Add photo"}
              </span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h2 className="text-sm font-light tracking-[0.22em] text-stone-500 uppercase mb-8">About</h2>

          {editing && adminMode ? (
            <div className="flex flex-col gap-3">
              <textarea
                autoFocus
                className="text-sm font-light text-stone-500 leading-relaxed border border-stone-200 rounded-lg outline-none p-3 bg-transparent resize-none w-full"
                rows={8}
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                placeholder="Write something about yourself…"
              />
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await setSetting({ key: "aboutText", value: textVal });
                    setEditing(false);
                    toast.success("About text saved");
                  }}
                  className="px-4 py-1.5 bg-black text-white text-xs rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-1.5 border border-gray-200 text-xs rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              className={`text-sm font-light text-stone-500 leading-relaxed whitespace-pre-wrap ${adminMode ? "cursor-pointer hover:opacity-60 transition-opacity" : ""} ${!aboutText && !adminMode ? "hidden" : ""}`}
              onClick={() => {
                if (adminMode) {
                  setTextVal(aboutText ?? "");
                  setEditing(true);
                }
              }}
            >
              {aboutText || (adminMode ? "Click to add your bio…" : "")}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
}
