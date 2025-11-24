import { useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
import inFilter from "../../lib/inFilter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../../context/session_context/useSession";

const fetchUserCommunities = async (userId) => {
  const { data, error } = await supabase
    .from("memberships")
    .select("role, communities (*)")
    .eq("user_id", userId);

  if (error) throw new Error("Issue fetching user communities!");

  if (data.length === 0) return [{ id: -1, name: "No Community" }];

  return data.map((com) => {
    return { role: com.role, ...com.communities };
  });
};

export default function useUserCommunities() {
  const queryClient = useQueryClient();

  const { session } = useSession();
  const userId = useMemo(() => session?.user?.id, [session]);

  const query = useQuery({
    queryKey: ["UserCommunities", userId],
    queryFn: () => fetchUserCommunities(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!userId || !query.data) return;

    const ids = query.data.map((c) => c.id);

    const channel = listenForUserCommunityChanges(userId, ids, (payload) => {
      queryClient.invalidateQueries(["UserCommunities", userId]);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, query]);

  return query;
}

function listenForUserCommunityChanges(userId, userCommunities, onChange) {
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
    .on(
      "postgres_changes",
      {
        event: "*", // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: "public",
        table: "communities",
        filter: inFilter("id", userCommunities),
      },
      (payload) => {
        console.log("🔄 User Communities change:", payload);
        onChange(payload);
      }
    )
    .subscribe();

  return channel;
}
