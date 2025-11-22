import { SessionContext } from "./SessionContext";
import Loading from "../../components/global/Loading";
import useUserInvitations from "../../hooks/useUserInvitations";
import useUserCommunities from "../../hooks/useUserCommunities";
import useUserProfile from "../../hooks/useUserProfile";
import useLogin from "../../hooks/useLogin";
import Auth from "../../components/auth/Auth";
import UpdatePasswordForm from "../../components/auth/UpdatePasswordForm";

export default function SessionProvider({ children }) {
  const { session, loading, inviteLogin, recoveryLogin, resetFlags } =
    useLogin();
  const [userCommunities, setUserCommunities, UpdateUserCommunities] =
    useUserCommunities(session);
  const [userInvitations, setUserInvitations] = useUserInvitations(session);
  const [userProfile, setUserProfile] = useUserProfile(session);

  if (loading) return <Loading />;
  if (recoveryLogin || inviteLogin)
    return (
      <UpdatePasswordForm
        onComplete={() => {
          resetFlags();
        }}
      />
    );

  if (!session)
    return (
      <div className="h-screen w-screen flex items-center justify-center flex-col">
        <div className="text-4xl">TinyShare™️</div>
        <Auth />
      </div>
    );

  return (
    <SessionContext.Provider
      value={{
        session,
        userCommunities,
        setUserCommunities,
        UpdateUserCommunities,
        userInvitations,
        setUserInvitations,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
