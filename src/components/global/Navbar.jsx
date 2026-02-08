import { Link, useLocation } from 'react-router';
import { useGlobal } from '../../context/useGlobal';
import { InvalidCommunityId } from '../../lib/InvalidCommunityId';
import Dropdown from '../ui/Dropdown';
import {
  CommunityNavIcon,
  DashboardNavIcon,
  NotificationNavIcon,
  ProfileNavIcon,
} from '../ui/Icons/Icons';
import { useMemo, useState } from 'react';
import SubContentText from '../ui/Text/SubContentText';
import ContentText from '../ui/Text/ContentText';
import SubFadedText from '../ui/Text/SubFadedText';
import { NotificationType } from '../../lib/NotificationType';
import UserInvitationPanel from '../ProfilePage/UserInvitationPanel';

const NavElements = [
  { path: '/dashboard', name: DashboardNavIcon, needCommunity: true },
  { path: '/community', name: CommunityNavIcon, needCommunity: true },
  { path: '/', name: ProfileNavIcon, needCommunity: false },
];

export default function Navbar() {
  const location = useLocation();
  const {
    activeCommunity,
    setActiveCommunity,
    userCommunities,
    userNotifications,
  } = useGlobal();

  const unreadNotifications = useMemo(() => {
    if (userNotifications.isPending || userNotifications.isError) return [];

    return userNotifications.data.filter(
      (notification) => !notification.dismissed,
    );
  }, [userNotifications]);

  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const HandleSelectActiveCommunity = (id) => {
    if (id === activeCommunity.id || userCommunities.isPending) return;
    setActiveCommunity(
      userCommunities.data.find((community) => {
        return community.id == id;
      }),
    );
    localStorage.setItem('tiny-share-active-community-id', id);
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
                    location.pathname === element.path && ' scale-110'
                  }`}
                >
                  <element.name
                    styles={location.pathname === element.path && 'text-accent'}
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

        <div
          className="relative"
          onClick={() => setShowNotificationModal(!showNotificationModal)}
        >
          <NotificationNavIcon
            styles={`cursor-pointer ${showNotificationModal && 'text-accent'}`}
          />
          {unreadNotifications.length != 0 && (
            <div className="w-4 h-4 bg-warning rounded-full absolute -top-1.5 -right-1.5  flex items-center justify-center text-sm">
              {unreadNotifications.length}
              {/* // created at timestamp
              // hook to dismiss
              // if link then link to it
              // type styling */}
            </div>
          )}
        </div>
      </div>
      {showNotificationModal && (
        <div
          className={`
            absolute top-28 
            right-auto md:right-10 
            md:top-14 z-50 bg-secondary 
            w-[400px] 
            rounded-md border-white 
            border flex flex-col p-4 
            items-center gap-4
            overflow-auto
            ${showNotificationModal ? 'h-[300px]' : 'h-0'}
          `}
        >
          <ContentText
            text="Notifications"
            styles="w-full text-center text-xl"
          />
          {unreadNotifications.length === 0 ? (
            <SubContentText text="-" styles="w-full text-center" />
          ) : (
            <div className="flex flex-col w-full hover:border-accent border border-accent/40 rounded-md p-2">
              {unreadNotifications.map((notification) => {
                return <div key={notification.id}>{notification.body}</div>;

                //
              })}
            </div>
          )}
        </div>
      )}
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
