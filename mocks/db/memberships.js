import { InitLs, lsKeys } from "../utils";

const dummyMemberships = [
  // { id: 0, userId: 0, communityId: 0, role: "admin" },
  { id: 2, userId: 0, communityId: 1, role: "member" },
  { id: 3, userId: 1, communityId: 0, role: "admin" },
  { id: 4, userId: 2, communityId: 0, role: "member" },
  { id: 5, userId: 3, communityId: 0, role: "member" },
];

export const memberships = await InitLs(lsKeys.memberships, dummyMemberships);
