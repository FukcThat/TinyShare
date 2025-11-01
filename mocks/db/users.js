import { InitLs, lsKeys } from "../utils";

const dummyUsers = [
  { id: 0, name: "Tony", email: "tony@test.com" },
  { id: 1, name: "Jim", email: "jim@test.com" },
  { id: 2, name: "Jones", email: "jones@test.com" },
  { id: 3, name: "Tracy", email: "tracy@test.com" },
];

export const users = await InitLs(lsKeys.users, dummyUsers);
