import ItemView from './ItemView';

export default function ItemListView({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        return <ItemView key={item.id} item={item} />;
      })}
    </div>
  );
}
