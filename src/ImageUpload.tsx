import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface Props {
  onUploaded: (id: Id<"_storage">, previewUrl: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function ImageUpload({ onUploaded, children, className }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      onUploaded(storageId, URL.createObjectURL(file));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={className}
      onClick={() => fileRef.current?.click()}
    >
      {uploading ? <span className="text-xs text-gray-400">Uploading…</span> : children}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
