import { Link, useLocation } from "react-router";
import { useGlobal } from "../context/useGlobal";
import CommunityDropdown from "./CommunityDropdown";

const NavElements = [
  { path: "/", name: "Home" },
  { path: "/items", name: "Items" },
  { path: "/members", name: "Members" },
  { path: "/profile", name: "Profile" },
];

export default function Navbar() {
  const location = useLocation();
  const { user } = useGlobal();

  return (
    <div className="flex my-6 px-10 w-full justify-between items-center flex-col md:flex-row">
      <div className="flex gap-4 items-center">
        {/* <div className="text-lg">{activeCommunity.name} Community</div> */}
        <CommunityDropdown />
        <div>-</div>
        <div>
          <div>{user.name}</div>
          <div className=" text-xs under">{user.email}</div>
        </div>
      </div>

      <div className="flex gap-4">
        {NavElements.map((element) => {
          return (
            <Link
              key={element.path}
              to={element.path}
              className={`hover:scale-110 transition-all text-2xl duration-50 ease-in ${
                location.pathname === element.path && " text-blue-400"
              }`}
            >
              {element.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
