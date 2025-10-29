import { memberships } from "../db/memberships";
import { delay } from "../utils";

export const membershipsApi = {
  async getAll() {
    await delay();
    return [...memberships];
  },
};
