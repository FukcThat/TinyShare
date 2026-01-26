import { useState } from 'react';
import { useSession } from '../../context/session_context/useSession';
import useToggleMemberRole from '../../hooks/tanstack_mutations/useToggleMemberRole';
import useKickMember from '../../hooks/tanstack_mutations/useKickMember';
import { useGlobal } from '../../context/useGlobal';
import SubContentText from '../ui/Text/SubContentText';
import FadedText from '../ui/Text/FadedText';
import SubFadedText from '../ui/Text/SubFadedText';
import Button from '../ui/Button';
import { LeaveIcon } from '../ui/Icons/Icons';
import ErrorText from '../ui/Text/ErrorText';

export default function MemberInfoRow({ member }) {
  const { session } = useSession();
  const { activeCommunity } = useGlobal();

  const [err, setErr] = useState(null);

  const ToggleMemberRole = useToggleMemberRole();
  const kickMember = useKickMember();

  const HandleKickMemberBtnClick = (memberId) => {
    kickMember.mutate(
      {
        memberId,
        activeCommunity,
      },
      {
        onSuccess: () => setErr(null),
        onError: (error) => setErr(error.message),
      }
    );
  };

  const HandleRoleToggleBtnClick = async (userToToggleId, userToToggleRole) => {
    let newRole = userToToggleRole == 'admin' ? 'member' : 'admin';
    ToggleMemberRole.mutate(
      {
        userToToggleId,
        newRole,
        communityId: activeCommunity.id,
      },
      {
        onError: (error) => {
          setErr(error.message);
        },
        onSuccess: () => setErr(null),
      }
    );
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-2 border ${
        member.profiles.id === session.user.id
          ? 'border-amber-400 dark:bg-primary'
          : 'border-white/10'
      } p-4 rounded-md justify-between w-full`}
    >
      <div className="flex flex-col items-start">
        <SubContentText text={member.profiles.name} />
        <FadedText text={member.profiles.email} />
        <SubFadedText
          text={`Joined ${new Date(member.profiles.created_at).toDateString()}`}
        />
      </div>
      {session.user.id === member.profiles.id ? (
        <div className="flex flex-col gap-2">
          <Button
            styles=" bg-warning/60 hover:bg-warning/80"
            disabled={kickMember.isPending}
            onClick={() => HandleKickMemberBtnClick(session.user.id)}
            text={'Leave Community'}
            icon={<LeaveIcon styles={'hover:scale-100'} />}
            iconPos="right"
          />
          {err && <ErrorText text={err} />}
        </div>
      ) : (
        activeCommunity.role == 'admin' && (
          <div className="flex flex-col">
            <div className="flex gap-2">
              <Button
                disabled={ToggleMemberRole.isPending}
                text={member.role == 'admin' ? 'Admin' : 'Member'}
                styles={`${
                  member.role == 'admin' && 'bg-accent/60 hover:bg-accent/80'
                }`}
                onClick={() => {
                  HandleRoleToggleBtnClick(member.profiles.id, member.role);
                }}
              />

              <Button
                disabled={kickMember.isPending}
                text="Remove"
                styles="bg-warning/60 hover:bg-warning/80"
                onClick={() => {
                  HandleKickMemberBtnClick(member.profiles.id);
                }}
              />
            </div>
            {err && <ErrorText text={err} />}
          </div>
        )
      )}
    </div>
  );
}
