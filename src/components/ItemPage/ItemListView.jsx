import ItemView from "./ItemView";

export default function ItemListView({ items, headerLabel }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="text-xl">{headerLabel}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          return <ItemView key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
}
