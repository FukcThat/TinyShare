import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";

const createCommunity = async ({ nameInput, user_id, role = "admin" }) => {
  const { data: communityData, error: communityError } = await supabase
    .from("communities")
    .insert([{ name: nameInput }])
    .select()
    .single();

  if (communityError) throw new Error("Issue Creating Community!");

  const { data: membershipData, error: membershipError } = await supabase
    .from("memberships")
    .insert([
      {
        user_id,
        community_id: communityData.id,
        role,
      },
    ])
    .select()
    .single();

  if (membershipError)
    throw new Error("Issue creating new community membership: ");

  return { communityData, membershipData };
};

export default function useCreateCommunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunity,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries("UserCommunities", variables.user_id);
    },
  });
}
