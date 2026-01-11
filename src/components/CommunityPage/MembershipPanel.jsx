import { useGlobal } from '../../context/useGlobal';
import Button from '../ui/Button';
import Loading from '../global/Loading';
import { useSession } from '../../context/session_context/useSession';
import useUserCommunities from '../../hooks/tanstack_queries/useUserCommunities';
import useToggleMemberRole from '../../hooks/tanstack_mutations/useToggleMemberRole';
import SubContentText from '../ui/Text/SubContentText';
import FadedText from '../ui/Text/FadedText';
import SubFadedText from '../ui/Text/SubFadedText';

export default function MembershipPanel({
  HandleKickMemberBtnClick,
  isKickLoading,
}) {
  const { activeCommunity, communityMembers } = useGlobal();
  const { session } = useSession();

  const { data: userCommunities } = useUserCommunities();
  const ToggleMemberRole = useToggleMemberRole();

  const HandleRoleToggleBtnClick = async (userToToggleId, userToToggleRole) => {
    let newRole = userToToggleRole == 'admin' ? 'member' : 'admin';
    ToggleMemberRole.mutate({
      userToToggleId,
      newRole,
      communityId: activeCommunity.id,
    });
  };

  if (!session || !userCommunities || !communityMembers) return <Loading />;

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 py-4">
      {/* List of Members */}
      {communityMembers.map((member) => {
        return (
          <div
            key={member.profiles.id}
            className={`flex flex-col sm:flex-row items-center gap-2 border ${
              member.profiles.id === session.user.id
                ? 'border-amber-400'
                : 'border-white/10'
            } p-4 rounded-md justify-between w-full`}
          >
            <div className="flex flex-col items-start">
              <SubContentText text={member.profiles.name} />
              <FadedText text={member.profiles.email} />
              <SubFadedText
                text={`Joined ${new Date(
                  member.profiles.created_at
                ).toDateString()}`}
              />
            </div>
            {session.user.id === member.profiles.id ? (
              <Button
                styles=" bg-warning/50 hover:bg-warning/80"
                disabled={false}
                onClick={() => HandleKickMemberBtnClick(session.user.id)}
                text="Leave Community🚶‍♀️‍➡️"
              />
            ) : (
              activeCommunity.role == 'admin' && (
                <div className="flex gap-2">
                  <Button
                    disabled={ToggleMemberRole.isPending}
                    text={member.role == 'admin' ? 'Admin' : 'Member'}
                    styles={`${
                      member.role == 'admin'
                        ? 'bg-accent hover:bg-accent/80'
                        : 'bg-accent/20 hover:bg-accent/40'
                    }`}
                    onClick={() => {
                      HandleRoleToggleBtnClick(member.profiles.id, member.role);
                    }}
                  />

                  <Button
                    disabled={isKickLoading}
                    text="Remove"
                    styles="bg-warning/50 hover:bg-warning/80"
                    onClick={() => {
                      HandleKickMemberBtnClick(member.profiles.id);
                    }}
                  />
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
