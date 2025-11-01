import { communities } from "../db/communities";
import { memberships } from "../db/memberships";
import { delay, lsKeys } from "../utils";
import { v4 as uuidv4 } from "uuid";

const NoCommunity = { id: -1, name: "No Community Yet...  " };

export const communitiesApi = {
  async getAll() {
    await delay();
    return [...communities];
  },

  async getUserCommunities(userId) {
    await delay(10);
    const res = communities.filter((community) =>
      memberships.some(
        (membership) =>
          membership.userId === userId &&
          membership.communityId === community.id
      )
    );
    return res.length === 0 ? [NoCommunity] : res;
  },

  async createCommunity(data) {
    await delay(20);
    const newCommunity = { id: uuidv4(), name: data.communityName };
    communities.push(newCommunity);
    const newMembership = {
      id: uuidv4(),
      userId: data.userId,
      communityId: newCommunity.id,
      role: "admin",
    };
    memberships.push(newMembership);

    localStorage.setItem(lsKeys.communities, JSON.stringify(communities));
    localStorage.setItem(lsKeys.memberships, JSON.stringify(memberships));

    return { ok: true, newCommunity };
  },
};
