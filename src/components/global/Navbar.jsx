import { Link, useLocation } from "react-router";
import { useGlobal } from "../../context/useGlobal";
import { InvalidCommunityId } from "../../lib/InvalidCommunityId";
import Dropdown from "../ui/Dropdown";
import {
  CommunityNavIcon,
  DashboardNavIcon,
  NotificationNavIcon,
  ProfileNavIcon,
} from "../ui/Icons/Icons";
import { useMemo, useState } from "react";
import SubContentText from "../ui/Text/SubContentText";
import ContentText from "../ui/Text/ContentText";

const NavElements = [
  { path: "/dashboard", name: DashboardNavIcon, needCommunity: true },
  { path: "/community", name: CommunityNavIcon, needCommunity: true },
  { path: "/", name: ProfileNavIcon, needCommunity: false },
];

export default function Navbar() {
  const location = useLocation();
  const { activeCommunity, setActiveCommunity, userCommunities } = useGlobal();

  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const notifications = useMemo(() => {
    // this is the beef of it
    // should look like so:
    // [{type: invite, data: inviteData},
    // {type: booking, data: data}]
    // here we need to get out community invites and append it to our notifications
    // if we have items, where bookings are pending, we should see it here too
    // what happens when bookings are cancelled?
  }, []);

  const HandleSelectActiveCommunity = (id) => {
    if (id === activeCommunity.id || userCommunities.isPending) return;
    setActiveCommunity(
      userCommunities.data.find((community) => {
        return community.id == id;
      }),
    );
    localStorage.setItem("tiny-share-active-community-id", id);
  };

  return (
    <div className="flex relative my-6 px-10 w-full justify-between items-center flex-col gap-4 md:flex-row">
      <div className="flex items-center">
        {NavElements.map((element) => {
          if (
            !element.needCommunity ||
            (activeCommunity && activeCommunity.id !== InvalidCommunityId)
          )
            return (
              <div className="flex relative mx-5" key={element.path}>
                <Link
                  to={element.path}
                  className={`hover:scale-110 active:scale-95 transition-all text-2xl duration-50 ease-in ${
                    location.pathname === element.path && " scale-110"
                  }`}
                >
                  <element.name
                    styles={location.pathname === element.path && "text-accent"}
                  />
                </Link>
              </div>
            );
        })}
      </div>
      <div className="flex items-center">
        <Dropdown
          styles="mx-5 border border-white rounded-lg px-4 py-2"
          options={userCommunities.isPending ? [] : userCommunities.data}
          onChange={(e) => HandleSelectActiveCommunity(e.target.value)}
          value={activeCommunity?.id}
        />
        {activeCommunity && activeCommunity.id != InvalidCommunityId && (
          <div onClick={() => setShowNotificationModal(!showNotificationModal)}>
            <NotificationNavIcon
              styles={`cursor-pointer ${showNotificationModal && "text-accent"}`}
            />
          </div>
        )}
      </div>
      <div
        className={`
            absolute top-28 
            right-auto md:right-10 
            md:top-14 z-50 bg-secondary 
            w-[400px] 
            rounded-md border-white 
            border flex flex-col p-4 
            overflow-scroll items-center
            transition-[max-height,opacity,transform]
            duration-1000
            ease-out
            ${
              showNotificationModal
                ? "max-h-[400px] opacity-100 scale-100"
                : "max-h-0 opacity-0 scale-95"
            }
          `}
      >
        <ContentText text="Notifications" styles="w-full text-center" />
      </div>
    </div>
  );
}

{
  /* {element.badge &&
                  userInvitations &&
                  userInvitations.length > 0 && (
                    <div className="absolute -right-3 -top-2 text-sm bg-red-500 rounded-full h-5 w-5 text-center">
                      {userInvitations.length}
                    </div>
                  )} */
}
