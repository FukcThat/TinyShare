import Loading from '../global/Loading';
import ItemView from '../global/ItemView';
import { useSession } from '../../context/session_context/useSession';

export default function ItemListView({ items }) {
  const { session } = useSession();

  return (
    <div className="grid grid-flow-row lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full">
      {!items ? (
        <Loading />
      ) : (
        items.map((item) => {
          return (
            <ItemView
              key={item.id}
              item={item}
              isOwner={session.user.id === item.owner.id}
            />
          );
        })
      )}
    </div>
  );
}
