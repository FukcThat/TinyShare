import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useUserInvitations(session) {
  const [userInvitations, setUserInvitations] = useState(null);

  const UpdateUserInvites = () => {
    supabase
      .from("invitations")
      .select("*, communities (*)")
      .eq("invitee_id", session.user.id)
      .then((res) => {
        setUserInvitations(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!session) return;
    UpdateUserInvites();

    const channel = listenForUserInviteChanges(session.user.id, (payload) => {
      UpdateUserInvites();
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]); // This Fetches the Invites when session changes

  return [userInvitations, setUserInvitations];
}

function listenForUserInviteChanges(userId, onChange) {
  const channel = supabase
    .channel(`userInvitations-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: "public",
        table: "invitations",
        filter: `invitee_id=eq.${userId}`,
      },
      (payload) => {
        console.log("🔄 User Invitations change:", payload);
        onChange(payload);
      }
    )
    .subscribe();

  return channel;
}
