import { useEffect, useState } from 'react';
import { GlobalContext } from './GlobalContext';
import useUserCommunities from '../hooks/tanstack_queries/useUserCommunities';
import useCommunityMembers from '../hooks/tanstack_queries/useCommunityMembers';
import useUserItems from '../hooks/tanstack_queries/useUserItems';
import useUserReservations from '../hooks/tanstack_queries/useUserReservations';
import useUserInvitations from '../hooks/tanstack_queries/useUserInvitations';
import useCommunityItems from '../hooks/tanstack_queries/useCommunityItems';
import useUserProfile from '../hooks/tanstack_queries/useUserProfile';
import { useSession } from './session_context/useSession';

export function GlobalProvider({ children }) {
  const [activeCommunity, setActiveCommunity] = useState(null);
  const { session } = useSession();

  const { data: userProfile } = useUserProfile(session);
  const { data: userCommunities } = useUserCommunities();
  const { data: communityMembers } = useCommunityMembers(activeCommunity);
  const { data: userItems } = useUserItems();
  const { data: userReservations } = useUserReservations();
  const { data: userInvitations } = useUserInvitations();
  const { data: communityItems } = useCommunityItems(
    activeCommunity,
    communityMembers
  );

  useEffect(() => {
    if (!userCommunities || userCommunities.length === 0) return;

    let lsCommunity = localStorage.getItem('tiny-share-active-community-id');

    if (
      lsCommunity != null &&
      userCommunities.find((com) => com.id === lsCommunity)
    ) {
      setActiveCommunity(userCommunities.find((com) => com.id == lsCommunity));
    } else {
      setActiveCommunity(userCommunities[0]);
      localStorage.setItem(
        'tiny-share-active-community-id',
        userCommunities[0].id
      );
    }
  }, [userCommunities]); // Fix how this works later -T

  return (
    <GlobalContext.Provider
      value={{
        activeCommunity,
        setActiveCommunity,
        communityMembers,
        userItems,
        userReservations,
        userInvitations,
        communityItems,
        userProfile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
