import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useUserCommunities(session) {
  const [userCommunities, setUserCommunities] = useState([]);
  const UpdateUserCommunities = () => {
    supabase
      .from("memberships")
      .select("role, communities (*)")
      .eq("user_id", session.user.id)
      .then((res) => {
        if (res.data.length === 0) {
          setUserCommunities([{ id: -1, name: "No Community" }]);
        } else {
          setUserCommunities(
            res.data.map((e) => {
              return { ...e.communities, role: e.role }; // This needs to be done, otherwise we get {role: "", communities: {}}
            })
          );
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!session) return;

    const channel = listenForUserCommunityChanges(
      session.user.id,
      (payload) => {
        UpdateUserCommunities();
      }
    );
    UpdateUserCommunities();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  return [userCommunities, setUserCommunities, UpdateUserCommunities];
}

function listenForUserCommunityChanges(userId, onChange) {
  const channel = supabase
    .channel(`userCommunities-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: "public",
        table: "memberships",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("🔄 User Communities change:", payload);
        onChange(payload);
      }
    )
    .subscribe();

  return channel;
}
