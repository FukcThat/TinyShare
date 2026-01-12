import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useCreateInvitation from '../../hooks/tanstack_mutations/useCreateInvitation';
import { useSession } from '../../context/session_context/useSession';
import { useGlobal } from '../../context/useGlobal';
import { SendInviteIcon } from '../ui/Icons/Icons';

export default function InviteForm() {
  const { session } = useSession();
  const { activeCommunity } = useGlobal();
  const [inviteeEmail, setInviteeEmail] = useState('anton.harbers23@gmail.com');
  const CreateInvitation = useCreateInvitation();

  const submitInvitation = async (e) => {
    e.preventDefault();
    if (inviteeEmail == '') return;

    CreateInvitation.mutate(
      {
        inviterId: session.user.id,
        inviteeEmail,
        activeCommunityId: activeCommunity.id,
      },
      { onSuccess: () => setInviteeEmail('') }
    );
  };

  return (
    <form
      onSubmit={submitInvitation}
      className="flex flex-col md:flex-row w-full justify-center gap-5 my-4"
    >
      <Input
        value={inviteeEmail}
        disabled={CreateInvitation.isPending}
        required
        type="email"
        placeholder="Enter new members email..."
        onChange={(e) => setInviteeEmail(e.target.value)}
        outerStyles="flex-grow"
        inputStyles="w-full"
      />
      <Button
        type="submit"
        disabled={CreateInvitation.isPending}
        text="Send"
        icon={<SendInviteIcon />}
        iconPos="right"
        styles="hover:bg-accent/80 bg-accent/60"
      />
    </form>
  );
}
