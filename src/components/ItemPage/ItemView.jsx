import Button from "../ui/Button";
import { useGlobal } from "../../context/useGlobal";
import { useItemContext } from "../../context/item_context/useItemContext";
import { useSession } from "../../context/session_context/useSession";
import { useMemo } from "react";

export default function ItemView({ item }) {
  const { setItemToRequest, setItemToEdit } = useItemContext();
  const { session } = useSession();
  const { communityMembers } = useGlobal();

  const owner = useMemo(
    () => communityMembers.find((user) => user.id === item.owner),
    [communityMembers]
  );

  return (
    <div
      className={`flex flex-col gap-4 bg-gray-700 items-center justify-center w-[250px] h-[250px] border-4 rounded-md hover:border-slate-50/40 `}
    >
      <div>{item.name}</div>
      <div>Owner: {owner.id === session.user.id ? "You" : owner.name} </div>

      {owner.id !== session.user.id ? (
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
