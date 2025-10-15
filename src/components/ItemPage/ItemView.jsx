import { useMemo } from "react";
import { userData } from "../../data/userData";
import Button from "../ui/Button";
import { reservationData } from "../../data/reservationData";
import { useGlobal } from "../../context/useGlobal";

export default function ItemView({
  item,
  withEdit,
  onEdit,
  onRequest,
  isBorrowedItem,
}) {
  const owner = userData.find((user) => user.id === item.owner);
  const { user } = useGlobal();

  const reservation = useMemo(
    () => reservationData.find((res) => res.itemId === item.id),
    [item]
  );

  const reservedBy = useMemo(
    () =>
      reservation
        ? userData.find((user) => user.id === reservation.userId)
        : { name: "" },
    [reservation]
  );

  return (
    <div
      className={`flex flex-col gap-4 bg-gray-700 items-center justify-center w-[250px] h-[250px] border-4 rounded-md hover:border-slate-50/40 
        ${
          isBorrowedItem
            ? "border-amber-400"
            : !item.isAvailable
            ? "border-red-400/50"
            : "border-green-400/50"
        } 
        `}
    >
      <div>{item.name}</div>
      <div>Owner: {owner.name} </div>
      {!isBorrowedItem && owner.id !== user.id && (
        <Button text="Request" onClick={() => onRequest(item)} />
      )}{" "}
      {isBorrowedItem && (
        <div>
          <div>{reservation.startDate}</div>
          <div>-</div>
          <div>{reservation.endDate}</div>
          <div>Reserved by: {reservedBy.name}</div>
        </div>
      )}
      {withEdit && (
        <div>
          <Button text="✏️" onClick={() => onEdit(item)} />{" "}
          <Button text="🗓️" onClick={() => onRequest(item)} />{" "}
        </div>
      )}
    </div>
  );
}
