import { invitations } from "./db/invitations";
import { items } from "./db/items";
import { memberships } from "./db/memberships";
import { reservations } from "./db/reservations";
import { users } from "./db/users";
import { delay } from "./utils";

export * from "./api/communitiesApi";
export * from "./api/membershipsApi";
export * from "./api/itemsApi";
export * from "./api/invitationsApi";
export * from "./api/usersApi";
export * from "./api/reservationsApi";

export const mockApi = {
  async getCommunityData(communityId, userId) {
    await delay();
    let userRole = null;
    // first lets get the items that belong to this community
    const communityItems = items.filter((item) => {
      return memberships.some(
        (mem) => mem.userId === item.owner && mem.communityId === communityId
      );
    });

    // then get all the members
    const communityMembers = users
      .filter((user) => {
        return memberships.some((membership) => {
          if (
            membership.userId === userId &&
            membership.communityId === communityId
          )
            userRole = membership.role;
          return (
            membership.userId == user.id &&
            membership.communityId == communityId
          );
        });
      })
      .map((user) => {
        return {
          ...user,
          role: memberships.find((mem) => mem.userId === user.id).role,
        };
      });

    const communityReservations = reservations.filter((res) =>
      memberships.some(
        (mem) => mem.userId == res.userId && mem.communityId === communityId
      )
    );

    const communityInvitations = invitations.filter(
      (inv) => inv.communityId === communityId
    );

    return {
      items: communityItems,
      members: communityMembers,
      reservations: communityReservations,
      invitations: communityInvitations,
      userRole: userRole,
    };
  },

  async login() {
    await delay(5);
    return users[0];
  },
};
