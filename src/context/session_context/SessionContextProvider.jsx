import { useEffect, useState } from "react";
import { SessionContext } from "./SessionContext";
import { communitiesApi, invitationsApi, mockApi } from "../../../mocks";
import Loading from "../../components/global/Loading";

export default function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);
  const [userInvitations, setUserInvitations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.login().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    communitiesApi.getUserCommunities(user.id).then((data) => {
      setUserCommunities(data);
    });
    invitationsApi
      .getUserInvitations(user.id)
      .then((data) => setUserInvitations(data));
  }, [user]);

  if (loading) return <Loading />;

  if (!user) return <div>Not Logged In</div>;

  return (
    <SessionContext.Provider
      value={{
        user,
        userCommunities,
        setUserCommunities,
        userInvitations,
        setUserInvitations,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
