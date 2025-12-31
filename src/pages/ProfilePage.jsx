import { useEffect, useMemo, useState } from "react";
import { useSession } from "../context/session_context/useSession";
import useUserProfile from "../hooks/tanstack_queries/useUserProfile";
import useCommunityItems from "../hooks/tanstack_queries/useCommunityItems";
import UserItemsView from "../components/ProfilePage/UserItemsView";
import ProfileHeader from "../components/ProfilePage/ProfileHeader";
import UserCommunitiesPanel from "../components/ProfilePage/UserCommunitiesPanel";
import InvitationPanel from "../components/membership/InvitationPanel";

export default function ProfilePage() {
  const { session } = useSession();
  const { data: communityItems } = useCommunityItems();

  const yourItems = useMemo(
    () =>
      communityItems
        ? communityItems.filter((item) => item.owner.id === session.user.id)
        : null,
    [communityItems]
  );

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <ProfileHeader yourItems={yourItems} />
      <UserCommunitiesPanel />
      <UserItemsView items={yourItems} />
    </div>
  );
}
