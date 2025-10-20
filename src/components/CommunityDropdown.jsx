import { useGlobal } from "../context/useGlobal";
import Dropdown from "./ui/Dropdown";

export default function CommunityDropdown() {
  const { userCommunities, activeCommunity, setActiveCommunity } = useGlobal();

  const HandleSelectActiveCommunity = (e) => {
    // when we change the data here, we want to update local storage
    setActiveCommunity(
      userCommunities.find((community) => {
        return community.id == e.target.value;
      })
    );
  };

  return activeCommunity ? (
    <Dropdown
      options={userCommunities}
      value={activeCommunity.id}
      onChange={HandleSelectActiveCommunity}
    />
  ) : (
    <div>Loading...</div>
  );
}
