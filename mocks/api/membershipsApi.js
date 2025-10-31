import { memberships } from "../db/memberships";
import { delay } from "../utils";

export const membershipsApi = {
  async getAll() {
    await delay();
    return [...memberships];
  },

  async toggleMemberRole(userId, communityId) {
    await delay();

    // find membership in db with userId and communityId and set role to admin or member,
    for (let member of memberships) {
      if (member.userId === userId && member.communityId === communityId) {
        member.role = member.role === "admin" ? "member" : "admin";
      }
    }

    return { ok: true }; // toggle that users role locally
  },

  async KickMember(userId, communityId) {
    await delay();

    let idx = null;
    for (let i = 0; i < memberships.length; i++) {
      if (
        memberships[i].userId === userId &&
        memberships[i].communityId === communityId
      )
        idx = i;
    }

    if (idx === null)
      return { ok: false, message: "Could not find membership" };

    memberships.splice(idx, 1);

    return { ok: true };
  },
};
