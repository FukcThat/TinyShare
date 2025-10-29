import { users } from "../db/users";
import { delay } from "../utils";

export const usersApi = {
  async getAll() {
    await delay();
    return [...users];
  },
};
