import { useEffect, useState } from "react";
import { useSession } from "../context/session_context/useSession";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loading from "../components/global/Loading";
import { supabase } from "../lib/supabaseClient";
import InvitationPanel from "../components/membership/InvitationPanel";

export default function ProfilePage() {
  const { userProfile, setUserProfile, session } = useSession();

  const [showForm, setShowForm] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const HandleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (nameInput == "") return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .update({ name: nameInput })
        .eq("id", session.user.id)
        .select("name")
        .single();

      if (error) throw new Error(error.message);

      setUserProfile(data);
      setShowForm(false);
      setNameInput(data.name);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userProfile) return;
    setNameInput(userProfile.name);
  }, [userProfile]);

  if (!userProfile) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="flex items-center justify-between w-[90%]">
        <div className="text-4xl">{userProfile.name}'s Profile</div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setNameInput(userProfile.name);
          }}
          text={showForm ? "Cancel" : "Edit Display Name"}
        />
      </div>
      {showForm && (
        <form
          onSubmit={HandleSubmitUpdate}
          className="flex flex-col items-center justify-center gap-4 bg-white/20 p-2 rounded-md"
        >
          <Input
            id="nameInput"
            withLabel
            labelText="New Display Name:"
            value={nameInput}
            outerStyles="flex flex-col"
            inputStyles="border-2 border-slate-200 rounded-md focus:border-green-400"
            onChange={(e) => setNameInput(e.target.value)}
          />
          <Button disabled={isLoading} type="submit" text="Submit" />
        </form>
      )}
      <div className="flex flex-col p-4 gap-4 justify-center">
        <div className="text-2xl">Your Community Invitations</div>
        <InvitationPanel />
      </div>
    </div>
  );
}
