import { useSession } from "../../context/session_context/useSession";
import { useGlobal } from "../../context/useGlobal";
import Dropdown from "../ui/Dropdown";
import Loading from "./Loading";

export default function CommunityDropdown() {
  const { activeCommunity, setActiveCommunity } = useGlobal();
  const { userCommunities } = useSession();

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
      styles="flex-grow"
    />
  ) : (
    <Loading />
  );
}
