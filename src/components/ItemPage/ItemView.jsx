import { userData } from "../../data/userData";
import Button from "../ui/Button";

export default function ItemView({ item, withEdit, onEdit }) {
  const owner = userData.find((user) => user.id === item.owner);
  return (
    <div
      className={`flex flex-col gap-4 bg-gray-700 items-center justify-center w-[250px] h-[250px] border-4 rounded-md hover:border-slate-50/40 
        ${
          item.status === "borrowed"
            ? "border-red-400/50"
            : "border-green-400/50"
        }
        `}
    >
      <div>{item.name}</div>
      <div>Owner: {owner.name} </div>
      <Button
        text="Request"
        onClick={() => console.log(item.name, " requested")}
      />
      {withEdit && <Button text="✏️" onClick={() => onEdit(item)} />}
    </div>
  );
}
