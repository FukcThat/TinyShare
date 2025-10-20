export class Community {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

export const communityData = [
  new Community(1, "Hills"),
  new Community(2, "Valley"),
];

export const NoCommunity = new Community(0, "No Community Yet...  ");
