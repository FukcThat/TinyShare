import { Activity, useMemo, useState } from "react";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";
import CommunityDropdown from "./CommunityDropdown";
import Input from "../ui/Input";
import { useSession } from "../../context/session_context/useSession";
import { communitiesApi } from "../../../mocks";

export default function Sidebar() {
  const { user, setUserCommunities } = useSession();
  const { userRole, activeCommunity } = useGlobal();

  const [isShowingCommunityForm, setIsShowingCommunityForm] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createNewCommunity = async (e) => {
    e.preventDefault();

    if (!nameInput) {
      window.alert("Please provide a name for the community :) ");
      return;
    }
    setIsLoading(true);
    try {
      const res = await communitiesApi.createCommunity({
        userId: user.id,
        communityName: nameInput,
      });

      if (!res.ok) throw new Error("Issue creating new community: ", res);

      setUserCommunities((oldCommunities) =>
        activeCommunity.id === -1
          ? [res.newCommunity]
          : [...oldCommunities, res.newCommunity]
      );
      setIsLoading(false);
      setNameInput("");
      setIsShowingCommunityForm(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const ToggleNewCommunityForm = () =>
    setIsShowingCommunityForm(!isShowingCommunityForm);

  return (
    <div className="absolute top-55 w-52 h-40 z-100 bg-blue-950">
      <div className="flex w-full justify-between">
        <CommunityDropdown />
        {userRole == "admin" && <Button text="✏️" />}
      </div>
      <div>
        <Button text="New Community" onClick={ToggleNewCommunityForm} />
        <Activity mode={isShowingCommunityForm ? "visible" : "hidden"}>
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
        </Activity>
      </div>
    </div>
  );
}
