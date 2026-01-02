import BgPanel from '../global/BgPanel';
import useActiveBooking from '../../hooks/useActiveBooking';

export default function ItemInfoPanel({ item }) {
  const { isBooked } = useActiveBooking(item);

  return (
    <BgPanel>
      <div className="flex w-full justify-between ">
        <div className="flex gap-4 items-center">
          <div className="h-24 w-24 border rounded-md">
            <img src="" className="cover" alt="item-img" />
          </div>
          <div className="text-2xl">{item.name}</div>
        </div>

        <div
          className={`px-4 py-1 rounded-sm h-fit ${
            isBooked ? 'bg-warning/50' : 'bg-emerald-700'
          }`}
        >
          {isBooked ? 'Currently Booked' : 'Available'}
        </div>
      </div>
      <div className="text-start w-full text-lg font-bold">Description</div>
      <div className="w-full text-wrap border-b border-b-accent pb-4">
        This is an item that does this and that and its the best! This is an
        item that does this and that and its the best! This is an item that does
        this and that and its the best!
      </div>
      <div>Owner: {item.owner.name}</div>
    </BgPanel>
  );
}
