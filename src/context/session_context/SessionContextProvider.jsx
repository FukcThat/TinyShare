import { SessionContext } from "./SessionContext";
import Loading from "../../components/global/Loading";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../../lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import useUserInvitations from "../../hooks/useUserInvitations";
import useUserCommunities from "../../hooks/useUserCommunities";
import useUserProfile from "../../hooks/useUserProfile";
import useLogin from "../../hooks/useLogin";

export default function SessionProvider({ children }) {
  const [session, loading] = useLogin();
  const [userCommunities, setUserCommunities, UpdateUserCommunities] =
    useUserCommunities(session);
  const [userInvitations, setUserInvitations] = useUserInvitations(session);
  const [userProfile, setUserProfile] = useUserProfile(session);

  if (loading) return <Loading />;

  if (!session)
    return (
      <div className="h-screen w-screen flex items-center justify-center flex-col">
        <div className="text-4xl">TinyShare™️</div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: { default: { colors: { inputText: "white" } } },
          }}
          providers={[]}
        />
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
