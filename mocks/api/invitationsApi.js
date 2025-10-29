import { invitations } from "../db/invitations";
import { delay } from "../utils";

export const invitationsApi = {
  async getAll() {
    await delay();
    return [...invitations];
  },
};
