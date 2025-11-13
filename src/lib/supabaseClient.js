import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export function listenForMembershipChanges(activeCommunityId, onChange) {
  const channel = supabase
    .channel(`community-${activeCommunityId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: "public",
        table: "memberships",
        filter: `community_id=eq.${activeCommunityId}`,
      },
      (payload) => {
        console.log("🔄 Membership change:", payload);
        onChange(payload);
      }
    )
    .subscribe();

  return channel;
}
