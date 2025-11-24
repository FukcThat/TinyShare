import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";

const acceptInvitation = async ({ user_id, community_id, role }) => {
  const { data, error } = await supabase
    .from("memberships")
    .insert([
      {
        user_id,
        community_id,
        role,
      },
    ])
    .select()
    .single();

  if (error) throw new Error("Issue creating Membership!");
  return data;
};

export default function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (data, variables) => {
      // variables = {userId, name}
      queryClient.invalidateQueries(["UserCommunities", variables.user_id]);
      queryClient.setQueryData(["UserInvitations", variables.user_id], (old) =>
        old.filter((invite) => invite.id !== data.id)
      );
    },
  });
}
