import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useUserProfile(session) {
  const [userProfile, setUserProfile] = useState(null);

  const UpdateUserProfile = () => {
    supabase
      .from("profiles")
      .select("name")
      .eq("id", session.user.id)
      .single()
      .then((res) => setUserProfile(res.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!session) return;

    UpdateUserProfile();
  }, [session]);

  return [userProfile, setUserProfile];
}
