import { Link, useLocation } from 'react-router';
import { useGlobal } from '../../context/useGlobal';
import { InvalidCommunityId } from '../../lib/InvalidCommunityId';

const NavElements = [
  { path: '/dashboard', name: 'Dashboard', needCommunity: true },
  { path: '/community', name: 'Community', needCommunity: true },
  { path: '/', name: 'Profile', needCommunity: false, badge: true },
];

export default function Navbar() {
  const location = useLocation();
  const { activeCommunity, userInvitations } = useGlobal();

  return (
    <div className="flex my-6 px-10 w-full justify-between items-center flex-col md:flex-row">
      <div className="flex gap-4 items-center justify-center w-full">
        {NavElements.map((element) => {
          if (
            !element.needCommunity ||
            (activeCommunity && activeCommunity.id !== InvalidCommunityId)
          )
            return (
              <div className="flex relative" key={element.path}>
                <Link
                  to={element.path}
                  className={`hover:scale-110 transition-all text-2xl duration-50 ease-in ${
                    location.pathname === element.path && ' text-blue-400'
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
