import { Link } from 'react-router';
import useActiveBooking from '../../hooks/useActiveBooking';

export default function ItemView({ item, isOwner = false }) {
  const { isBooked } = useActiveBooking(item);

  return (
    <Link
      to={`/items/${item.id}`}
      className="bg-primary hover:bg-primary/75 rounded-xl gap-2 w-full flex flex-row"
    >
      <div className="w-24 h-24">
        <img
          src=""
          className=" w-full h-full border-2 border-black rounded-md"
        />
      </div>

      <div className="flex flex-col grow">
        <div className=" text-lg">{item.name}</div>
        <div className="">item.description</div>
        {!isOwner && <div className="text-sm">Owner: {item.owner.name}</div>}
      </div>

      <div className="flex justify-end p-2 h-fit">
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
