import { useEffect, useState } from "react";
import InvitationPanel from "../components/membership/InvitationPanel";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Theme } from "@fullcalendar/core/internal";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function HomePage() {
  const [communities, setCommunities] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      console.log(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    supabase
      .from("communities")
      .select()
      .then((res) => {
        console.log(res.data);
        setCommunities(res.data);
      })
      .catch((error) => console.error(error));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!session)
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
      />
    );

  return (
    <>
      <InvitationPanel />
      <ul>
        {communities.map((community) => (
          <li key={community.id}> {community.name}</li>
        ))}
      </ul>
    </>
  );
}
