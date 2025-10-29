import { Activity } from "react";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";
import Loading from "../global/Loading";

export default function MembershipPanel() {
  const { communityMembers, userRole, ToggleRole, KickMember } = useGlobal();

  if (!userRole) return <Loading />;

  return (
    <div>
      MembershipPanel
      {/* List of Members */}
      <div>
        {communityMembers.map((member) => {
          return (
            <div key={member.id}>
              <div>{member.name}</div>
              <Activity mode={userRole == "admin" ? "visible" : "hidden"}>
                <Button
                  text={member.role == "admin" ? "admin" : "member"}
                  onClick={() => {
                    ToggleRole(member.id);
                  }}
                />
                <Button
                  text="Kick Member out"
                  onClick={() => {
                    KickMember(member.id);
                  }}
                />
                {/* 
                Make role toggle button 
                Implement role toggle onClick 
                -- > Change role of member with this id & is in this (active) community

                Make DeleteMemberschip button 
                --> Remove membership from membershipArray with this id & in this community */}
              </Activity>
            </div>
          );
        })}
      </div>
      {/* If admin: Way to change members role, invite & kick */}
    </div>
  );
}
