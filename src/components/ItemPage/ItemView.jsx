import { userData } from "../../data/userData";
import Button from "../ui/Button";
import { useGlobal } from "../../context/useGlobal";
import { useItemContext } from "../../context/item_context/useItemContext";

export default function ItemView({ item }) {
  const { setItemToRequest, setItemToEdit } = useItemContext();
  const { user } = useGlobal();
  const owner = userData.find((user) => user.id === item.owner); // Change this to use userData state later

  return (
    <div
      className={`flex flex-col gap-4 bg-gray-700 items-center justify-center w-[250px] h-[250px] border-4 rounded-md hover:border-slate-50/40 `}
    >
      <div>{item.name}</div>
      <div>Owner: {owner.name} </div>

      {owner.id !== user.id ? (
        <Button text="Request" onClick={() => setItemToRequest(item)} />
      ) : (
        <div>
          <Button
            text="✏️"
            onClick={() =>
              setItemToEdit((old) =>
                old === null || old.id != item.id ? item : null
              )
            }
          />
          <Button text="🗓️" onClick={() => setItemToRequest(item)} />
        </div>
      )}
    </div>
  );
}
