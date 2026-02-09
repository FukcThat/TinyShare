import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useCreateInvitation from '../../hooks/tanstack_mutations/useCreateInvitation';
import { useSession } from '../../context/session_context/useSession';
import { useGlobal } from '../../context/useGlobal';
import { SendInviteIcon } from '../ui/Icons/Icons';
import ErrorText from '../ui/Text/ErrorText';

export default function InviteForm() {
  const { session } = useSession();
  const { activeCommunity, communityMembers, userProfile } = useGlobal();
  const [inviteeEmail, setInviteeEmail] = useState('anton.harbers23@gmail.com');
  const CreateInvitation = useCreateInvitation();

  const [err, setErr] = useState(null);

  const submitInvitation = async (e) => {
    e.preventDefault();
    setErr(null);

    if (inviteeEmail == '') {
      return;
    }

    if (
      communityMembers.data.find(
        (member) => member.profiles.email === inviteeEmail,
      )
    ) {
      setErr('Member with this email already exists!');
      return;
    }

    CreateInvitation.mutate(
      {
        inviterId: session.user.id,
        inviteeEmail,
        activeCommunityId: activeCommunity.id,
        activeCommunityName: activeCommunity.name,
        inviterName: userProfile.data.name,
      },
      {
        onSuccess: () => setInviteeEmail(''),
        onError: (error) => setErr(error.message),
      },
    );
  };

  return (
    <form onSubmit={submitInvitation} className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row w-full justify-center gap-5 my-4">
        <Input
          value={inviteeEmail}
          disabled={CreateInvitation.isPending}
          required
          type="email"
          placeholder="Enter new members email..."
          onChange={(e) => setInviteeEmail(e.target.value)}
          outerStyles="flex-grow"
          inputStyles="w-full"
          maxLength={1000}
        />
        <Button
          type="submit"
          disabled={CreateInvitation.isPending}
          text="Send"
          icon={<SendInviteIcon />}
          iconPos="right"
          styles="hover:bg-accent/80 bg-accent/60"
        />
      </div>
      {err && <ErrorText text={err} />}
    </form>
  );
}
