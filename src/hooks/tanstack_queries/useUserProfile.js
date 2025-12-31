import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";

const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, created_at")
    .eq("id", userId)
    .single();

  if (error) throw new Error("Issue fetching user profile!");
  return data;
};

export default function useUserProfile(session) {
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const query = useQuery({
    queryKey: ["UserProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });

  return query;
}
