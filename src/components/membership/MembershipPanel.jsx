import { useState } from "react";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";
import Loading from "../global/Loading";
import { membershipsApi } from "../../../mocks";
import { useSession } from "../../context/session_context/useSession";

export default function MembershipPanel({
  HandleKickMemberBtnClick,
  isKickLoading,
}) {
  const { communityMembers, setCommunityMembers, activeCommunity } =
    useGlobal();
  const { session, userCommunities } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const HandleRoleToggleBtnClick = async (userToToggleId) => {
    try {
      setIsLoading(true);
      const res = await membershipsApi.toggleMemberRole(
        userToToggleId,
        activeCommunity.id
      );

      if (!res.ok) throw new Error("Issue with role toggle: ", res);

      setCommunityMembers((oldMembers) =>
        oldMembers.map((member) => {
          if (member.id === userToToggleId) {
            return {
              ...member,
              role: member.role === "admin" ? "member" : "admin",
            };
          }
          return member;
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session || !userCommunities || !communityMembers) return <Loading />;

  return (
    <div>
      MembershipPanel
      {/* List of Members */}
      <div>
        {communityMembers.map((member) => {
          return (
            <div
              key={member.id}
              className="flex gap-4 items-center m-10 bg-white/10 p-2 rounded-md justify-around"
            >
              <div>{member.email}</div>
              {activeCommunity.role == "admin" &&
                session.user.id !== member.id && (
                  <>
                    <Button
                      disabled={isLoading}
                      text={member.role == "admin" ? "admin" : "member"}
                      onClick={() => {
                        HandleRoleToggleBtnClick(member.id);
                      }}
                    />

                    <Button
                      disabled={isKickLoading}
                      text="Kick Member out"
                      onClick={() => {
                        HandleKickMemberBtnClick(member.id);
                      }}
                    />
                  </>
                )}

              {/* 
                Make role toggle button 
                Implement role toggle onClick 
                -- > Change role of member with this id & is in this (active) community

                Make DeleteMemberschip button 
                --> Remove membership from membershipArray with this id & in this community */}
            </div>
          );
        })}
      </div>
      {/* If admin: Way to change members role, invite & kick */}
    </div>
  );
}
