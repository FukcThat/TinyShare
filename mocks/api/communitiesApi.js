import { communities } from "../db/communities";
import { memberships } from "../db/memberships";
import { delay } from "../utils";

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
};

const NoCommunity = { id: -1, name: "No Community Yet...  " };
