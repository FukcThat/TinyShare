import { Link, useLocation } from "react-router";
import { useGlobal } from "../../context/useGlobal";
import { useSession } from "../../context/session_context/useSession";
import useUserInvitations from "../../hooks/tanstack_queries/useUserInvitations";

const NavElements = [
  { path: "/items", name: "Items", needCommunity: true },
  { path: "/members", name: "Members", needCommunity: true },
  { path: "/", name: "Profile", needCommunity: false, badge: true },
];

export default function Navbar({ ToggleSidebar }) {
  const location = useLocation();
  const { session } = useSession();
  const { data: userInvitations } = useUserInvitations();
  const { activeCommunity } = useGlobal();

  return (
    <div className="flex my-6 px-10 w-full justify-between items-center flex-col md:flex-row">
      {/* <div className="flex gap-4 items-center">
        <div className="text-lg">{activeCommunity.name} Community</div>
        <Button
          text={activeCommunity ? activeCommunity.name : "Loading..."}
          onClick={ToggleSidebar}
        />
      </div> */}

      <div className="flex gap-4 items-center justify-center">
        {NavElements.map((element) => {
          if (
            !element.needCommunity ||
            (activeCommunity && activeCommunity.id !== -1)
          )
            return (
              <div className="flex relative" key={element.path}>
                <Link
                  to={element.path}
                  className={`hover:scale-110 transition-all text-2xl duration-50 ease-in ${
                    location.pathname === element.path && " text-blue-400"
                  }`}
                >
                  {element.name}
                </Link>
                {element.badge &&
                  userInvitations &&
                  userInvitations.length > 0 && (
                    <div className="absolute -right-3 -top-2 text-sm bg-red-500 rounded-full h-5 w-5 text-center">
                      {userInvitations.length}
                    </div>
                  )}
              </div>
            );
        })}
      </div>
    </div>
  );
}
