import { Link } from 'react-router';
import useActiveBooking from '../../hooks/useActiveBooking';

export default function ItemView({ item, isOwner = false }) {
  const { isBooked } = useActiveBooking(item);

  return (
    <Link
      to={`/items/${item.id}`}
      className="bg-primary hover:bg-primary/75 rounded-xl gap-2 w-full flex flex-row p-2 max-h-28 relative"
    >
      <div className="w-24 h-24">
        <img
          src={item.image_url}
          className=" w-full h-full rounded-md"
          alt="No Image Available"
        />
      </div>

      <div className="flex flex-col w-[calc(100%-6rem)]">
        <div className=" text-lg py-1 truncate w-[calc(100%-80px)]">
          {item.name}
        </div>
        <div className="text-sm truncate ">{item.description}</div>
        {!isOwner && <div className="text-sm">Owner: {item.owner.name}</div>}
      </div>

      <div className="absolute right-1 top-1 p-2 h-fit">
        <div
          className={` text-sm rounded-md px-2 ${
            !item.is_available || isBooked ? 'bg-warning/80' : 'bg-emerald-700'
          }`}
        >
          {!item.is_available
            ? 'Not Available'
            : isBooked
            ? 'Booked'
            : 'Available'}
        </div>
      </div>
    </Link>
  );
}
