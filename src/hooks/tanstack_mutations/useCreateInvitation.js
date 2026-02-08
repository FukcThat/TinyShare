import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { NotificationType } from '../../lib/NotificationType';

const createInvitation = async ({
  inviterId,
  inviteeEmail,
  activeCommunityId,
}) => {
  let { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select()
    .eq('email', inviteeEmail);

  if (profilesError) throw new Error('Error looking for profiles.');

  let inviteeId = null;

  if (profilesData.length === 1) {
    inviteeId = profilesData[0].id;
  }

  if (profilesData.length === 0) {
    const { data: inviteEmailData, error: inviteEmailError } =
      await supabase.functions.invoke('invite-new-user', {
        body: { email: inviteeEmail },
      });

    if (inviteEmailError)
      throw new Error('App Invite Error: ', inviteEmailError.message);

    inviteeId = inviteEmailData.data.user.id;
  }

  const { data: invitationData, error: inviteCreationError } = await supabase
    .from('invitations')
    .insert([
      {
        inviter_id: inviterId,
        community_id: activeCommunityId,
        invitee_email: inviteeEmail,
        invitee_id: inviteeId,
        role: 'member',
      },
    ])
    .select(
      `*,       
      invitee:profiles!invitations_invitee_id_fkey(*),
      inviter:profiles!invitations_inviter_id_fkey1(*)`,
    )
    .single();

  if (inviteCreationError) throw new Error('Error creating invitation!');

  const { error: notificationError } = await supabase
    .from('notifications')
    .insert({
      recipient: inviteeId,
      type: NotificationType.invite_created,
      data: JSON.stringify(invitationData),
    });

  if (notificationError)
    throw new Error('Issue creating notification for booking approval');

  return invitationData;
};

export default function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvitation,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['CommunityInvitations', variables.activeCommunityId],
        (old) => [...old, data],
      );
    },
  });
}
