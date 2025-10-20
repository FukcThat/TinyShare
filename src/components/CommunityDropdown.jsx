import { useGlobal } from "../context/useGlobal";

export default function CommunityDropdown() {
  const { userCommunities, activeCommunity, setActiveCommunity } = useGlobal();

  return activeCommunity ? (
    <select
      className="bg-slate-900"
      value={activeCommunity.id}
      onChange={(e) =>
        setActiveCommunity(
          userCommunities.find((community) => {
            return community.id == e.target.value;
          })
        )
      }
    >
      {userCommunities.map((community) => {
        return (
          <option
            className="bg-slate-800"
            key={community.id}
            value={community.id}
          >
            {community.name}
          </option>
        );
      })}
    </select>
  ) : (
    <div>Loading...</div>
  );
}
