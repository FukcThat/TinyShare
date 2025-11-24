import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useLogin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteLogin, setInviteLogin] = useState(false);
  const [recoveryLogin, setRecoveryLogin] = useState(false);

  const hashRef = useRef(null);

  const resetFlags = () => {
    setInviteLogin(false);
    setRecoveryLogin(false);
  };

  useEffect(() => {
    // -----------------------------
    // Parse Supabase hash fragment
    // -----------------------------
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.slice(1));

      hashRef.current = {
        type: params.get("type"), // "invite", "recovery", etc.
        access_token: params.get("access_token"),
        refresh_token: params.get("refresh_token"),
      };
    }

    // Remove hash from the URL after parsing so refresh won't re-trigger
    if (hashRef.current?.type || hashRef.current?.access_token) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event === "SIGNED_IN") {
        if (hashRef.current?.type === "invite") setInviteLogin(true);
        if (hashRef.current?.type === "recovery") setRecoveryLogin(true);
      }
    });

    // If tokens are present -> set session right away
    async function handleInitialAuth() {
      setLoading(true);
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession);

        const type = hashRef.current?.type;

        if (!currentSession && type) {
          if (type === "invite") setInviteLogin(true);
          if (type === "recovery") setRecoveryLogin(true);
        }

        if (
          !currentSession &&
          hashRef.current?.access_token &&
          hashRef.current?.refresh_token
        ) {
          const { data, error } = await supabase.auth.setSession({
            access_token: hashRef.current.access_token,
            refresh_token: hashRef.current.refresh_token,
          });

          if (error) throw error;
          if (data?.session) setSession(data.session);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    handleInitialAuth();

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    loading,
    inviteLogin,
    recoveryLogin,
    resetFlags,
  };
}
