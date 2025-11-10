import React, { use, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { supabase } from "../../lib/supabaseClient";
import { useSession } from "../../context/session_context/useSession";
import { useGlobal } from "../../context/useGlobal";

export default function InviteForm() {
  const { session } = useSession();
  const { activeCommunity } = useGlobal();

  const [isLoading, setIsLoading] = useState(false);
  const [inviteeEmail, setInviteeEmail] = useState("");

  const submitInvitation = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (inviteeEmail == "") return;
      console.log(inviteeEmail);

      // Check if the user is an admin

      let { data: profiles, error } = await supabase
        .from("profiles")
        .select()
        .eq("email", inviteeEmail);

      console.log(profiles, error);

      if (error) throw new Error("Error looking for profiles,", error.message);

      let inviteeId = null;

      if (profiles.length === 1) {
        inviteeId = profiles[0].id;
      }

      if (profiles.length === 0) {
        const { data: inviteEmailData, inviteEmailError } =
          await supabase.functions.invoke("invite-new-user", {
            body: { email: inviteeEmail },
          });

        if (inviteEmailError)
          throw new Error("App Invite Error: ", inviteEmailError.message);

        inviteeId = inviteEmailData.data.user.id;
      }

      const { data: invitation, inviteCreationError } = await supabase
        .from("invitations")
        .insert([
          {
            inviter_id: session.user.id,
            community_id: activeCommunity.id,
            invitee_email: inviteeEmail,
            invitee_id: inviteeId,
            role: "member",
          },
        ])
        .select()
        .single();

      if (inviteCreationError)
        throw new Error(
          "Error creating invitation,",
          inviteCreationError.message
        );

      console.log(invitation);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    // Either way: Update local state
  };

  return (
    <form onSubmit={submitInvitation}>
      <Input
        value={inviteeEmail}
        disabled={isLoading}
        required
        type="email"
        withLabel
        labelText="Enter Email"
        placeholder="someone@somewhere.com"
        onChange={(e) => setInviteeEmail(e.target.value)}
      />
      <Button type="submit" text="submit" />
    </form>
  );
}
