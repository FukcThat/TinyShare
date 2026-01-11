import { Link } from 'react-router';
import useActiveBooking from '../../hooks/useActiveBooking';
import ContentText from '../ui/Text/ContentText';
import SubContentText from '../ui/Text/SubContentText';
import FadedText from '../ui/Text/FadedText';

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
        <ContentText
          text={item.name}
          styles="py-1 truncate w-[calc(100%-80px)]"
        />
        <SubContentText text={item.description} styles="truncate" />
        {!isOwner && (
          <SubContentText
            text={`Owner: ${item.owner.name}`}
            styles="truncate"
          />
        )}
      </div>

      <div className="absolute right-1 top-1 p-2 h-fit">
        <FadedText
          styles={` text-text-primary rounded-md px-2 ${
            !item.is_available || isBooked ? 'bg-warning/80' : 'bg-emerald-700'
          }`}
          text={
            !item.is_available
              ? 'Not Available'
              : isBooked
              ? 'Booked'
              : 'Available'
          }
        />
      </div>
    </Link>
  );
}
