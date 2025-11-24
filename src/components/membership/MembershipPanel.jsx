import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";
import Loading from "../global/Loading";
import { useSession } from "../../context/session_context/useSession";
import useUserCommunities from "../../hooks/tanstack_queries/useUserCommunities";
import useCommunityMembers from "../../hooks/tanstack_queries/useCommunityMembers";
import useToggleMemberRole from "../../hooks/tanstack_mutations/useToggleMemberRole";

export default function MembershipPanel({
  HandleKickMemberBtnClick,
  isKickLoading,
}) {
  const { activeCommunity } = useGlobal();
  const { session } = useSession();

  const { data: communityMembers } = useCommunityMembers(activeCommunity);
  const { data: userCommunities } = useUserCommunities();
  const ToggleMemberRole = useToggleMemberRole();

  const HandleRoleToggleBtnClick = async (userToToggleId, userToToggleRole) => {
    let newRole = userToToggleRole == "admin" ? "member" : "admin";
    ToggleMemberRole.mutate({
      userToToggleId,
      newRole,
      communityId: activeCommunity.id,
    });
  };

  if (!session || !userCommunities || !communityMembers) return <Loading />;

  return (
    <div className="flex flex-col items-center justify-center text-3xl">
      Community Members
      {/* List of Members */}
      <div>
        {communityMembers.map((member) => {
          return (
            <div
              key={member.profiles.id}
              className="flex gap-4 text-lg items-center m-10 bg-white/10 p-4 rounded-md justify-around"
            >
              <div>Email: {member.profiles.email}</div>
              {activeCommunity.role == "admin" &&
                session.user.id !== member.profiles.id && (
                  <>
                    <Button
                      disabled={ToggleMemberRole.isPending}
                      text={member.role == "admin" ? "admin" : "member"}
                      onClick={() => {
                        HandleRoleToggleBtnClick(
                          member.profiles.id,
                          member.role
                        );
                      }}
                    />

                    <Button
                      disabled={isKickLoading}
                      text="Kick Member out"
                      onClick={() => {
                        HandleKickMemberBtnClick(member.profiles.id);
                      }}
                    />
                  </>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
