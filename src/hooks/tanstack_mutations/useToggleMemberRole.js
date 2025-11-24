import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";

const toggleMemberRole = async ({ userToToggleId, newRole, communityId }) => {
  const { data, error } = await supabase
    .from("memberships")
    .update({ role: newRole })
    .eq("user_id", userToToggleId)
    .eq("community_id", communityId)
    .select()
    .single();

  if (error) throw new Error("Issue with role toggle call!");

  return data;
};

export default function useToggleMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleMemberRole,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(
        ["CommunityMembers"],
        variables.communityId
      );
    },
  });
}
