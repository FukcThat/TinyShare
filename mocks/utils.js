export const delay = (ms = Math.random() * 400 + 200) =>
  new Promise((res) => setTimeout(res, ms));

export const lsKeys = {
  invitations: "invitationsData",
  communities: "communitiesData",
  items: "itemsData",
  memberships: "membershipsData",
  reservations: "reservationsData",
  users: "usersData",
};

export const InitLs = async (key, defaultData) => {
  if (!localStorage.getItem(key)) return defaultData;

  try {
    return await JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error);
    return defaultData;
  }
};
