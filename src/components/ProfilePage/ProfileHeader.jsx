import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import EditProfileForm from "./EditProfileForm";
import useUserProfile from "../../hooks/tanstack_queries/useUserProfile";
import { useSession } from "../../context/session_context/useSession";
import Loading from "../global/Loading";

const oneDay = 24 * 60 * 60 * 1000;

export default function ProfileHeader({ yourItems }) {
  const { session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const { data: userProfile } = useUserProfile(session);

  useEffect(() => {
    if (!userProfile) return;
    setNameInput(userProfile.name);
  }, [userProfile]);

  const HandleLogOut = async () => {
    try {
      let { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(error);
    }
  };

  const accountAge = useMemo(() => {
    return (
      Math.floor((Date.now() - new Date(userProfile?.created_at)) / oneDay) || 0
    );
  }, [userProfile]);

  const totalItems = useMemo(() => {
    return yourItems?.length || 0;
  }, [yourItems]);

  const availableItems = useMemo(() => {
    return yourItems?.filter((item) => item.is_available).length || 0;
  }, [yourItems]);

  if (!userProfile) return <Loading />;

  return (
    <div className="bg-secondary p-4 rounded-xl flex flex-col items-center justify-between w-[90%] gap-4">
      <div className="flex justify-between w-full border-b-2 border-accent py-4">
        {userProfile && userProfile.name != "" ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {showForm ? (
                <EditProfileForm
                  nameInput={nameInput}
                  setShowForm={setShowForm}
                  setNameInput={setNameInput}
                />
              ) : (
                <div className="text-text-primary flex gap-2 text-2xl">
                  {userProfile.name}
                </div>
              )}
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  setNameInput(userProfile.name);
                }}
                styles="bg-primary p-1"
                text={showForm ? "❌" : "✏️"}
              />
            </div>

            <div className="text-sm text-text-primary/90 font-light">
              {session.user.email}
            </div>
          </div>
        ) : (
          <div>{session.user.email}</div>
        )}
        <Button
          styles="bg-warning/60 hover:bg-warning"
          onClick={HandleLogOut}
          text="Logout"
        />
      </div>

      {/* PROFILE DETAILS */}
      <div className="flex flex-col gap-4 md:flex-row justify-between w-full ">
        {[
          ["Account Age: ", accountAge + "Days"],
          ["Total Items: ", totalItems],
          ["Available Items: ", availableItems],
        ].map((e) => {
          return (
            <div key={e[0]}>
              <div className="text-sm text-text-primary/80">{e[0]}</div>
              <div className="text-lg text-text-primary">{e[1]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
