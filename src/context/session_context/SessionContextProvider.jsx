import { useEffect, useState } from "react";
import { SessionContext } from "./SessionContext";
import Loading from "../../components/global/Loading";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../../lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";

export default function SessionProvider({ children }) {
  const [userCommunities, setUserCommunities] = useState([]);
  const [userInvitations, setUserInvitations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Login
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    supabase
      .from("profiles")
      .select("name")
      .eq("id", session.user.id)
      .single()
      .then((res) => setUserProfile(res.data))
      .catch((error) => console.error(error));
  }, [session]);

  useEffect(() => {
    // Get User Communities and Invitations
    if (!session) return;

    supabase
      .from("memberships")
      .select("role, communities (*)")
      .eq("user_id", session.user.id)
      .then((res) => {
        setUserCommunities(
          res.data.map((e) => {
            return { ...e.communities, role: e.role };
          })
        );
      })
      .catch((err) => console.error(err));
    // invitationsApi
    //   .getUserInvitations(user.id)
    //   .then((data) => setUserInvitations(data));
  }, [session]);

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
