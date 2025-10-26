import { Activity, useMemo, useState } from "react";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";
import CommunityDropdown from "./CommunityDropdown";
import { Community } from "../../data/communityData";
import { Membership } from "../../data/membershipData";
import Input from "../ui/Input";

export default function Sidebar() {
  const { user, activeCommunity, setCommunities, memberships, setMemberships } =
    useGlobal();

  const activeMembership = useMemo(() => {
    if (!memberships) return;

    return memberships.find(
      (mem) => mem.userId == user.id && mem.communityId == activeCommunity.id
    );
  }, [user, activeCommunity, memberships]);

  const [isShowingCommunityForm, setIsShowingCommunityForm] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const createNewCommunity = (e) => {
    e.preventDefault();

    if (!nameInput) {
      window.alert("Please provide a name for the community :) ");
      return;
    }

    const newCommunity = new Community(uuidv4(), nameInput);
    setCommunities((oldCommunities) => [...oldCommunities, newCommunity]);

    const newMembership = new Membership(
      uuidv4(),
      user.id,
      newCommunity.id,
      "admin"
    );
    setMemberships((oldMemberships) => [...oldMemberships, newMembership]);

    setNameInput("");
    setIsShowingCommunityForm(false);
  };

  const ToggleNewCommunityForm = () =>
    setIsShowingCommunityForm(!isShowingCommunityForm);

  return (
    <div className="absolute top-55 w-52 h-40 z-100 bg-blue-950">
      <div className="flex w-full justify-between">
        <CommunityDropdown />
        {activeMembership && activeMembership.role == "admin" && (
          <Button text="✏️" />
        )}
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
            <Button type="submit" text="Done!" />
          </form>
        </Activity>
      </div>
    </div>
  );
}
