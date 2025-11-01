import { invitations } from "../db/invitations";
import { memberships } from "../db/memberships";
import { delay, lsKeys } from "../utils";
import { v4 as uuidv4 } from "uuid";

export const invitationsApi = {
  async getAll() {
    await delay();
    return [...invitations];
  },

  async getUserInvitations(userId) {
    await delay();

    return invitations.filter((invite) => invite.inviteeId === userId);
  },

  async AcceptCommunityInvite(inviteId) {
    await delay();
    let newMembership = null,
      idx = null;
    for (let i = 0; i < invitations.length; i++) {
      if (invitations[i].id === inviteId) {
        idx = i;
        newMembership = {
          id: uuidv4(),
          userId: invitations[i].inviteeId,
          communityId: invitations[i].communityId,
          role: invitations[i].role,
        };
      }
    }

    if (!newMembership)
      return { ok: false, message: "Could not find invitation" };

    memberships.push(newMembership);
    invitations.splice(idx, 1);

    localStorage.setItem(lsKeys.memberships, JSON.stringify(memberships));
    localStorage.setItem(lsKeys.invitations, JSON.stringify(invitations));

    return { ok: true };
  },

  async DeclineCommunityInvite(inviteId) {
    await delay();
    let idx = null;
    for (let i = 0; i < invitations.length; i++) {
      if (invitations[i].id === inviteId) {
        idx = i;
      }
    }

    if (idx === null)
      return { ok: false, message: "Could not find invitation" };

    invitations.splice(idx, 1);

    localStorage.setItem(lsKeys.invitations, JSON.stringify(invitations));

    return { ok: true };
  },
};
