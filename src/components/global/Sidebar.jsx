import { useState } from "react";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";
import CommunityDropdown from "./CommunityDropdown";
import Input from "../ui/Input";
import { useSession } from "../../context/session_context/useSession";
import { supabase } from "../../lib/supabaseClient";

export default function Sidebar() {
  const { session, setUserCommunities } = useSession();
  const { activeCommunity } = useGlobal();

  const [isShowingCommunityForm, setIsShowingCommunityForm] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editNameInput, setEditNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [communityToEdit, setCommunityToEdit] = useState(null);

  const createNewCommunity = async (e) => {
    e.preventDefault();

    if (!nameInput) {
      window.alert("Please provide a name for the community :) ");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("communities")
        .insert([{ name: nameInput }])
        .select()
        .single();

      if (error)
        throw new Error("Issue creating new community: ", error.message);

      const { data: membershipData, error: membershipError } = await supabase
        .from("memberships")
        .insert([
          {
            user_id: session.user.id,
            community_id: data.id,
            role: "admin",
          },
        ])
        .select()
        .single();

      if (membershipError)
        throw new Error(
          "Issue creating new community: ",
          membershipError.message
        );

      setUserCommunities((oldCommunities) =>
        activeCommunity.id === -1
          ? [{ ...data, role: "admin" }]
          : [...oldCommunities, { ...data, role: "admin" }]
      );
      setNameInput("");
      setIsShowingCommunityForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const HandleSubmitUpdate = async (e) => {
    e.preventDefault();

    if (editNameInput === "") return;

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("communities")
        .update({ name: editNameInput })
        .eq("id", communityToEdit.id)
        .select()
        .single();

      if (error) throw new Error("Issue updating community data: ", error);
      setUserCommunities((oldCommunities) =>
        oldCommunities.map((community) => {
          if (community.id !== communityToEdit.id) return community;

          return { ...community, name: data.name };
        })
      );
      setEditNameInput("");
      setCommunityToEdit(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
            <Button disabled={isLoading} type="submit" text="Submit" />
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
            <Button disabled={isLoading} type="submit" text="Done!" />
          </form>
        )}
      </div>
    </div>
  );
}
