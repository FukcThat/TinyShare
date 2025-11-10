import { useState } from "react";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";
import Loading from "../global/Loading";
import { useSession } from "../../context/session_context/useSession";
import { supabase } from "../../lib/supabaseClient";

export default function MembershipPanel({
  HandleKickMemberBtnClick,
  isKickLoading,
}) {
  const { communityMembers, setCommunityMembers, activeCommunity } =
    useGlobal();
  const { session, userCommunities } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const HandleRoleToggleBtnClick = async (userToToggleId, userToToggleRole) => {
    try {
      setIsLoading(true);
      // here we have to update the role of the user

      let newRole = userToToggleRole == "admin" ? "member" : "admin";

      const { data, error } = await supabase
        .from("memberships")
        .update({ role: newRole })
        .eq("user_id", userToToggleId)
        .eq("community_id", activeCommunity.id)
        .select()
        .single();

      if (error) throw new Error("Issue with role toggle: ", error.message);

      setCommunityMembers((oldMembers) =>
        oldMembers.map((member) => {
          if (member.id === data.user_id) {
            return {
              ...member,
              role: data.role,
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
                        HandleRoleToggleBtnClick(member.id, member.role);
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
