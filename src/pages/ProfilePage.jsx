import { useEffect, useState } from "react";
import { useSession } from "../context/session_context/useSession";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loading from "../components/global/Loading";
import { supabase } from "../lib/supabaseClient";

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
    <div>
      <div>{userProfile.name}</div>
      <Button onClick={() => setShowForm(!showForm)} text="Edit" />
      {showForm && (
        <form onSubmit={HandleSubmitUpdate}>
          <Input
            id="nameInput"
            labelText="Name:"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <Button disabled={isLoading} type="submit" text="Update Profile" />
        </form>
      )}
    </div>
  );
}
