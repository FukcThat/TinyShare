import { InitLs, lsKeys } from "../utils";

const dummyCommunities = [
  { id: 0, name: "Hills" },
  { id: 1, name: "Valleys" },
];

export const communities = await InitLs(lsKeys.communities, dummyCommunities);
