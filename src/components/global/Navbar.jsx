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
import NotificationModal from './NotificationModal';

const NavElements = [
  { path: '/dashboard', name: DashboardNavIcon, needCommunity: true },
  { path: '/community', name: CommunityNavIcon, needCommunity: true },
  { path: '/', name: ProfileNavIcon, needCommunity: false },
];

export default function Navbar() {
  const location = useLocation();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const {
    activeCommunity,
    setActiveCommunity,
    userCommunities,
    userNotifications,
  } = useGlobal();

  const sortedNotifications = useMemo(() => {
    if (userNotifications.isPending || userNotifications.isError) return [];

    return userNotifications.data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [userNotifications]);

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
      {/* Nav Elements */}
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
        {/* Active Community Dropdow */}
        <Dropdown
          styles="mx-5 border border-white rounded-lg px-4 py-2"
          options={userCommunities.isPending ? [] : userCommunities.data}
          onChange={(e) => HandleSelectActiveCommunity(e.target.value)}
          value={activeCommunity?.id}
        />
        {/* Notification Toggle and Badge */}
        <div
          className="relative"
          onClick={() => setShowNotificationModal(!showNotificationModal)}
        >
          <NotificationNavIcon
            styles={`cursor-pointer ${showNotificationModal && 'text-accent'}`}
          />
          {sortedNotifications.length != 0 && (
            <div className="w-4 h-4 bg-warning rounded-full absolute -top-1.5 -right-1.5  flex items-center justify-center text-sm">
              <SubContentText
                text={sortedNotifications.length}
                styles="flex items-center justify-center"
              />
            </div>
          )}
        </div>
      </div>
      {showNotificationModal && (
        <NotificationModal
          showNotificationModal={showNotificationModal}
          sortedNotifications={sortedNotifications}
        />
      )}
    </div>
  );
}
