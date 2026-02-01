import { Link, useLocation } from 'react-router';
import { useGlobal } from '../../context/useGlobal';
import { InvalidCommunityId } from '../../lib/InvalidCommunityId';
import Dropdown from '../ui/Dropdown';

const NavElements = [
  { path: '/dashboard', name: 'Dashboard', needCommunity: true },
  { path: '/community', name: 'Community', needCommunity: true },
  { path: '/', name: 'Profile', needCommunity: false },
];

export default function Navbar() {
  const location = useLocation();
  const { activeCommunity, setActiveCommunity, userCommunities } = useGlobal();

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
    <div className="flex relative my-6 px-10 w-full justify-center items-center flex-col-reverse md:flex-row">
      {NavElements.map((element) => {
        if (
          !element.needCommunity ||
          (activeCommunity && activeCommunity.id !== InvalidCommunityId)
        )
          return (
            <div className="flex relative mx-5" key={element.path}>
              <Link
                to={element.path}
                className={`hover:scale-110 transition-all text-2xl duration-50 ease-in ${
                  location.pathname === element.path && ' text-blue-400'
                }`}
              >
                {element.name}
              </Link>
            </div>
          );
      })}
      <Dropdown
        styles="mx-5 hover:scale-105"
        options={userCommunities.isPending ? [] : userCommunities.data}
        onChange={(e) => HandleSelectActiveCommunity(e.target.value)}
        value={activeCommunity?.id}
      />
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
