import { useParams } from "react-router";
import useCommunityItems from "../hooks/tanstack_queries/useCommunityItems";
import { useMemo } from "react";
import Loading from "../components/global/Loading";

export default function ItemPage() {
  const { id } = useParams();
  const { data } = useCommunityItems();

  const item = useMemo(() => {
    return data?.find((item) => item.id === id) || null;
  }, [data]);

  if (!data) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="bg-secondary p-4 rounded-xl flex flex-col items-center justify-between w-[90%] gap-4">
        <div className="flex w-full gap-4">
          <div className="h-24 w-24 border rounded-md">
            <img src="" className="cover" alt="item-img" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-2xl">{item.name}</div>
            <div className="text-sm text-text-secondary">Category</div>
          </div>
        </div>
        <div className="text-start w-full text-lg font-bold">Description</div>
        <div className="w-full text-wrap border-b border-b-accent pb-4">
          This is an item that does this and that and its the best! This is an
          item that does this and that and its the best! This is an item that
          does this and that and its the best!
        </div>
        <div>Owner: {item.owner.name}</div>
      </div>
    </div>
  );
}

// Name Category Booking Status Description Owner Info Panel
// If your item here you can edit details
// Then Booking Calander
// Booking History?
// Book this item panel
