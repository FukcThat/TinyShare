import { useState } from "react";
import ItemView from "./ItemView";

export default function ItemListView({
  items,
  headerLabel,
  withEdit = false,
  onEdit = () => {},
  onRequest = () => {},
  isBorrowedList = false,
}) {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex">
        {" "}
        <div className="text-xl">{headerLabel}</div>
        <div onClick={() => setMinimized(!minimized)}>🔻</div>
      </div>

      {!minimized && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            return (
              <ItemView
                key={item.id}
                item={item}
                withEdit={withEdit}
                onEdit={onEdit}
                onRequest={onRequest}
                isBorrowedItem={isBorrowedList}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
