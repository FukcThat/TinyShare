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
import useCommunityInvitations from '../hooks/tanstack_queries/useCommunityInvitations';

export function GlobalProvider({ children }) {
  const [activeCommunity, setActiveCommunity] = useState(null);

  const { session } = useSession();
  const communityInvitations = useCommunityInvitations(activeCommunity);
  const userProfile = useUserProfile(session);
  const userCommunities = useUserCommunities();
  const communityMembers = useCommunityMembers(activeCommunity);
  const userItems = useUserItems();
  const userReservations = useUserReservations();
  const { data: userInvitations } = useUserInvitations();
  const communityItems = useCommunityItems(activeCommunity, communityMembers);

  useEffect(() => {
    if (userCommunities.isPending || userCommunities.data.length === 0) return;

    let lsCommunity = localStorage.getItem('tiny-share-active-community-id');

    if (
      lsCommunity != null &&
      userCommunities.data.find((com) => com.id === lsCommunity)
    ) {
      setActiveCommunity(
        userCommunities.data.find((com) => com.id == lsCommunity)
      );
    } else {
      setActiveCommunity(userCommunities.data[0]);
      localStorage.setItem(
        'tiny-share-active-community-id',
        userCommunities.data[0].id
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
        communityInvitations,
        userCommunities,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
