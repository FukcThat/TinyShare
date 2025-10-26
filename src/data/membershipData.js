export class Membership {
  constructor(id, userId, communityId, role) {
    this.id = id;
    this.userId = userId;
    this.communityId = communityId;
    this.role = role;
  }
}

export const membershipData = [
  new Membership(0, 1, 1, "admin"), // John is admin of Hills
  new Membership(1, 1, 2, "member"), // John is member of Valley

  new Membership(2, 2, 1, "member"), // Maya is member of Hills
  new Membership(3, 3, 1, "admin"), // Bob is admin of Valley
];
