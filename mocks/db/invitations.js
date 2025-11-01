import { InitLs, lsKeys } from "../utils";

const dummyInvitations = [
  {
    id: 0,
    inviterId: 1,
    inviteeId: 0,
    communityId: 0,
    role: "admin",
  },
];

export const invitations = await InitLs(lsKeys.invitations, dummyInvitations);
