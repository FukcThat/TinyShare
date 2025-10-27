export class Invitation {
  constructor(id, inviterId, inviteeId, communityId, role = "member") {
    this.id = id;
    this.inviterId = inviterId;
    this.inviteeId = inviteeId;
    this.communityId = communityId;
    this.role = role;
  }
}

export const dummyInvitations = [new Invitation(0, 1, 1, 1, "member")];
