import { useAuthActions } from "@convex-dev/auth/react";

interface Props {
  adminMode: boolean;
  setAdminMode: (v: boolean) => void;
}

export function AdminBar({ adminMode, setAdminMode }: Props) {
  const { signOut } = useAuthActions();

  return (
    <div className="fixed top-0 left-0 right-0 z-[600] flex items-center justify-between px-6 py-3 bg-black/90 backdrop-blur text-white text-sm">
      <span className="font-light tracking-widest uppercase text-xs opacity-60">
        Signed in · editor
      </span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setAdminMode(!adminMode)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
            adminMode
              ? "bg-white text-black"
              : "border border-white/30 text-white/70 hover:border-white hover:text-white"
          }`}
        >
          {adminMode ? "Editing" : "Edit mode"}
        </button>
        <button
          type="button"
          onClick={() => void signOut()}
          className="text-white/50 hover:text-white transition-colors text-xs"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
