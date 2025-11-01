import { InitLs, lsKeys } from "../utils";

let dummyItems = [
  { id: 0, name: "Pot", isAvailable: true, owner: 0 },
  { id: 1, name: "Pan", isAvailable: true, owner: 1 },
  { id: 2, name: "Chair", isAvailable: true, owner: 1 },
  { id: 3, name: "Kayak", isAvailable: true, owner: 2 },
];

export const items = await InitLs(lsKeys.items, dummyItems);
