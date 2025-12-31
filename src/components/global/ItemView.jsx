import { Link } from "react-router";

export default function ItemView({ item, isOwner = false }) {
  const isBooked = true;
  return (
    <Link
      to={`/items/${item.id}`}
      className="bg-primary hover:bg-primary/75 rounded-xl gap-2 w-full flex transition-all duration-75"
    >
      <div className="w-24 h-24">
        <img
          src=""
          className=" w-full h-full border-2 border-black rounded-md"
        />
      </div>
      <div className="flex flex-col grow">
        <div className="flex justify-between">
          <div
            className={` text-sm rounded-md ${
              isBooked ? "bg-text-warning/80" : "bg-green-500"
            }`}
          >
            {isBooked ? "Booked" : "Available"}
          </div>
          <div className="text-sm px-2 rounded-md bg-black/40">
            item.category
          </div>
        </div>
        <div className=" text-lg">{item.name}</div>
        <div className="">item.description</div>
        {!isOwner && <div className="text-sm">Owner: {item.owner.name}</div>}
      </div>
    </Link>
  );
}
