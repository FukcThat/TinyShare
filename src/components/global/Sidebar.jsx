import { useState } from "react";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";
import CommunityDropdown from "./CommunityDropdown";
import Input from "../ui/Input";
import { useSession } from "../../context/session_context/useSession";
import { supabase } from "../../lib/supabaseClient";
import useCreateCommunity from "../../hooks/tanstack_mutations/useCreateCommunity";
import useUpdateCommunity from "../../hooks/tanstack_mutations/useUpdateCommunity";

export default function Sidebar() {
  const { session } = useSession();
  const { activeCommunity } = useGlobal();

  const [isShowingCommunityForm, setIsShowingCommunityForm] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editNameInput, setEditNameInput] = useState("");

  const [communityToEdit, setCommunityToEdit] = useState(null);
  const CreateCommunity = useCreateCommunity();
  const UpdateCommunity = useUpdateCommunity();

  const createNewCommunity = (e) => {
    e.preventDefault();

    if (!nameInput) {
      window.alert("Please provide a name for the community :) ");
      return;
    }

    CreateCommunity.mutate(
      {
        nameInput,
        user_id: session.user.id,
        role: "admin",
      },
      {
        onSuccess: () => {
          setNameInput("");
          setIsShowingCommunityForm(false);
        },
      }
    );
  };

  const HandleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (editNameInput === "") return;

    UpdateCommunity.mutate(
      {
        communityToEditId: communityToEdit.id,
        editNameInput,
      },
      {
        onSuccess: () => {
          setEditNameInput("");
          setCommunityToEdit(null);
        },
      }
    );
  };

  return (
    <div className="absolute top-55 w-56 h-auto bg-blue-950 p-4 flex flex-col gap-4 ">
      <div className="flex w-full justify-between">
        <CommunityDropdown />
        {activeCommunity && activeCommunity.role == "admin" && (
          <Button
            onClick={() => {
              setEditNameInput(activeCommunity.name);
              setCommunityToEdit((old) => (old ? null : activeCommunity));
            }}
            text="✏️"
          />
        )}
      </div>
      <div>
        {communityToEdit && (
          <form
            onSubmit={HandleSubmitUpdate}
            className="flex flex-col items-center justify-center gap-4 bg-white/20 p-2 rounded-md"
          >
            <Input
              id="editNameInput"
              withLabel
              labelText="New Community Name:"
              value={editNameInput}
              outerStyles="flex flex-col"
              inputStyles="border-2 border-slate-200 rounded-md focus:border-green-400"
              onChange={(e) => setEditNameInput(e.target.value)}
            />
            <Button
              disabled={UpdateCommunity.isPending}
              type="submit"
              text="Submit"
            />
          </form>
        )}
      </div>
      <div>
        <Button
          text="New Community"
          onClick={() => {
            setNameInput("");
            setIsShowingCommunityForm(!isShowingCommunityForm);
          }}
        />
        {isShowingCommunityForm && (
          <form onSubmit={createNewCommunity}>
            <Input
              withLabel
              labelText="Community Name"
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
              }}
            />
            <Button
              disabled={CreateCommunity.isPending}
              type="submit"
              text="Done!"
            />
          </form>
        )}
      </div>
    </div>
  );
}
