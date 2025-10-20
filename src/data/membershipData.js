export class Membership {
  constructor(id, userId, communityId, role) {
    this.id = id;
    this.userId = userId;
    this.communityId = communityId;
    this.role = role;
  }
}

export const membershipData = [
  new Membership(1, 1, 1, "admin"),
  new Membership(1, 1, 2, "member"),

  new Membership(1, 2, 1, "member"),
  new Membership(1, 3, 2, "admin"),
];
