import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { CollectionBanner } from "./CollectionBanner";

export function Home({ adminMode }: { adminMode: boolean }) {
  const collections = useQuery(api.collections.list) ?? [];
  return (
    <div id="collections" className="scroll-mt-24 md:scroll-mt-28">
      {collections.map((collection, index) => (
        <CollectionBanner
          key={collection._id}
          collection={collection}
          isFirst={index === 0}
          adminMode={adminMode}
        />
      ))}
    </div>
  );
}

