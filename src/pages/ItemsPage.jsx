import ItemListView from '../components/ItemPage/ItemListView';
import { useGlobal } from '../context/useGlobal';
import { itemData } from '../data/itemData';

export default function ItemsPage() {
  const { user } = useGlobal();
  const availableItems = itemData.filter((item) => item.status === 'available');
  const yourItems = itemData.filter((item) => item.owner === user.id);
  return (
    <div className="flex flex-col gap-10">
      <div className="text-xl">Available Items:</div>
      <ItemListView items={availableItems} />
      <div className="text-xl">Your Items:</div>
      <ItemListView items={yourItems} />
    </div>
  );
}
