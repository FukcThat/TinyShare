import { useState } from "react";
import ItemView from "./ItemView";
import Loading from "../global/Loading";

export default function ItemListView({ items, headerLabel }) {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex">
        <div className="text-xl">{headerLabel}</div>
        <div onClick={() => setMinimized(!minimized)}>
          {minimized ? "🔺" : "🔻"}
        </div>
      </div>

      {!minimized && (
        <div className="flex flex-wrap gap-2 w-full min-h-60">
          {!items ? (
            <Loading />
          ) : (
            items.map((item) => {
              return <ItemView key={item.id} item={item} />;
            })
          )}
        </div>
      )}
    </div>
  );
}
