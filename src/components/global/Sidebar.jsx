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

  const ToggleNewCommunityForm = () =>
    setIsShowingCommunityForm(!isShowingCommunityForm);

  return (
    <div className="absolute top-55 w-52 h-40 z-100 bg-blue-950">
      <div className="flex w-full justify-between">
        <CommunityDropdown />
        {activeCommunity && activeCommunity.role == "admin" && (
          <Button
            onClick={() =>
              setCommunityToEdit((old) => (old ? null : activeCommunity))
            }
            text="✏️"
          />
        )}
      </div>
      <div>
        {" "}
        {communityToEdit && (
          <div>
            Edit {communityToEdit.name} <Button text="🗑️" />
          </div>
        )}
      </div>
      <div>
        <Button text="New Community" onClick={ToggleNewCommunityForm} />
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
