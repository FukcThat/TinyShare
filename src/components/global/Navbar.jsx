import { Link, useLocation } from "react-router";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";
import { useSession } from "../../context/session_context/useSession";
import { supabase } from "../../lib/supabaseClient";

const NavElements = [
  { path: "/", name: "Home", needCommunity: false },
  { path: "/items", name: "Items", needCommunity: true },
  { path: "/members", name: "Members", needCommunity: true },
  { path: "/profile", name: "Profile", needCommunity: false },
];

export default function Navbar({ ToggleSidebar }) {
  const location = useLocation();
  const { session, userProfile } = useSession();
  const { activeCommunity } = useGlobal();

  const HandleLogOut = async () => {
    try {
      let { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex my-6 px-10 w-full justify-between items-center flex-col md:flex-row">
      <div className="flex gap-4 items-center">
        {/* <div className="text-lg">{activeCommunity.name} Community</div> */}
        <Button
          text={activeCommunity ? activeCommunity.name : "Loading..."}
          onClick={ToggleSidebar}
        />
        <div>-</div>
        {userProfile && userProfile.name != "" ? (
          <div className="flex flex-col">
            <div>{userProfile.name}</div>
            <div className="text-sm opacity-75 font-light">
              {session.user.email}
            </div>
          </div>
        ) : (
          <div>{session.user.email}</div>
        )}
      </div>

      <div className="flex gap-4 items-center justify-center">
        {NavElements.map((element) => {
          if (
            !element.needCommunity ||
            (activeCommunity && activeCommunity.id !== -1)
          )
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
        <Button
          styles="bg-red-500 hover:bg-red-600"
          onClick={HandleLogOut}
          text="Sign-Out"
        />
      </div>
    </div>
  );
}
